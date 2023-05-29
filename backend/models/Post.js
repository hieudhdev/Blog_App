const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: {type: String},
    summary: {type: String},
    content: {type: String},
    cover: {type: String},
    author: {type: Schema.Types.ObjectId, ref: 'User'},
}, {
    timestamps: true,
})


const PostModel = mongoose.model('Post', PostSchema);

module.exports = PostModel;
