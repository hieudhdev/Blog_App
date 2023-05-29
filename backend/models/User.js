const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username : { type: String, min: 6, required: true, unique: true },
    password : { type: String, min: 6, required: true },
})


const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;

