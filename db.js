const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/data', {});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    Bio: { type: String },
    userID: { type: Number, unique: true } 
});

const postSchema = new mongoose.Schema({
    image: {type: String},
    title: {type: String},
    username: {type: String},
    postDate: {type: String},
    postText: {type: String},
    userID: {type: String},
    postID: {type: Number}
});

const commentSchema = new mongoose.Schema({
    image: {type: String},
    username: {type: String},
    commentDate: {type: String},
    commentText: {type: String},
    postID: {type: Number}
});




const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);
const Comment = mongoose.model('Comment', commentSchema);

module.exports = { User, Post, Comment};