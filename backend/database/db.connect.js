const mongoose = require('mongoose');
mongoose.set('strictQuery', false); // stop log db warning in terminal

const connectDB = async () => {
    try {
        //mongoDB connection string
        const connect = await mongoose.connect(process.env.MONGO_URI, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // useFindAndModify: false
            // useCreateIndex: true
        })
        
        console.log('Connect database successfully!')
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDB