const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDB = require('./database/db.connect');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' })
const fs = require('fs');


// variables environment config
dotenv.config({ path: 'config.env' });
const PORT = process.env.PORT || 4000; 

// cors config
app.use(cors({ credentials:true, origin:'http://localhost:3000' }));

// parser request
app.use(bodyParser.json());

// connect database
connectDB();

// static files : uploads
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

// api
const salt = bcrypt.genSaltSync(10);
const secret = 'asdfe45we45w345wegw345werjktjwertkj'
const UserDB = require('./models/User');
const PostDB = require('./models/Post');
app.use(cookieParser());

// register 
app.post('/register', async (req, res) => {
    
    const {username,password} = req.body;

    // Check duplicate username
    // UserDB
    //     .findOne({ username: username})
    //     .then((data) => {
    //         if (data) {
    //             console.log(data);
    //             res.status(100).send("Username already exists!");
    //             return;
    //         }
    //     })
    //     .catch( () => {
            
    //     } )

    try {
        const userDoc = await UserDB.create({
            username,
            password: bcrypt.hashSync(password,salt),
        });
        res.json(userDoc);
    } catch(e) {
        console.log(e);
        res.status(400).json(e);
    }
    
    
});

// login
app.post('/login', async (req, res) => {
    
    const {username,password} = req.body;
    const userDoc = await UserDB.findOne({username});
    const passOk = bcrypt.compareSync(password, userDoc.password);

    if (passOk) {
        // logged in
        jwt.sign({username,id:userDoc._id}, secret, {}, (err,token) => {
            if (err) throw err;
            res.cookie('token', token).json({
                id:userDoc._id,
                username,
            });
        });
    } else {
        res.status(400).json('User account or password incorrect!');
    }

});

// logout
app.post('/logout', (req, res) => {
    res.cookie('token', '').json('done');
});

// get profile
app.get('/profile', (req,res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err,info) => {
      if (err) throw err;
      res.json(info);
    });
});

// create post
app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
    const {originalname,path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
    
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err,info) => {

        if (err) throw err;

        const {title, summary, content} = req.body;

        const postDoc = await PostDB.create({
            title,
            summary,
            content,
            cover: newPath,
            author: info.id,
        })
    
        res.json(postDoc);
    });
})

// get all post
app.get('/post', async (req, res) => {

    const postDoc = await PostDB.find()
        .populate('author', ['username'])
        .sort({createdAt: -1})
        .limit(20)

    res.json(postDoc);
})

// get all post of an author
app.get('/mypost/:id', async (req, res) => {
    const {id} = req.params;
    const postDoc = await PostDB.find({
            author : { _id: id },
        })
        .populate('author', ['username'])
        .sort({createdAt: -1})
        .limit(20)

    res.json(postDoc);
})

// get specific post
app.get('/post/:id', async (req, res) => {
    const {id} = req.params;
    const postDoc = await PostDB.findById(id).populate('author', ['username']);
    res.json(postDoc);
})

// edit post
app.put('/post', uploadMiddleware.single('file'), async (req,res) => {
    let newPath = null;
    if (req.file) {
      const {originalname,path} = req.file;
      const parts = originalname.split('.');
      const ext = parts[parts.length - 1];
      newPath = path + '.' + ext;
      fs.renameSync(path, newPath);
    }
  
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err,info) => {

      if (err) throw err;

      const {id,title,summary,content} = req.body;
      const postDoc = await PostDB.findById(id);
      const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);

      if (!isAuthor) {
        return res.status(400).json('you are not the author');
      }

      await PostDB.findOneAndUpdate({_id : id}, {
        title,
        summary,
        content,
        cover: newPath ? newPath : postDoc.cover,
      });
  
      res.json(postDoc);
    });
  
});

// delete post
app.delete('/post/delete/:id', async (req, res) => {
    const {id} = req.params;

    const postDoc = await PostDB.findOneAndDelete({
        _id: id,
    })
    res.json(postDoc);
})

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
});