const mongoose = require('mongoose');
require('dotenv').config();  // Load environment variables from .env file

// Use the MONGO_URI from the environment variables
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true, 
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

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

module.exports = { User, Post, Comment };
