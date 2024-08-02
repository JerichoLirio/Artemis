const express = require('express');
const router = express.Router();
const { getData } = require('./UserInfo.js');
const { User, Post, Comment} = require('./db');

const dataUser = getData();

router.get('/', async (req, res) => {
    try {
        let postResult = await Post.find({}).exec();
        const cleanedPosts = postResult.map(post => ({
            _id: post._id,
            image: post.image,
            title: post.title,
            username: post.username,
            postDate: post.postDate,
            postText: post.postText,
            comments: post.comments,
            postID: post.postID
        }));
        
        res.render('home', {
            layout: 'index',
            title: 'Home',
            user: req.session.user,
            posts: cleanedPosts
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});


router.post('/createPost', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).send({ success: false, message: 'Unauthorized' });
    }

    const { postText } = req.body;
    const username = req.session.user;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).send({ success: false, message: 'User not found' });
        }

        const newPost = new Post({
            username: user.username,
            postText,
            postDate: new Date(),
            comments: []
        });

        await newPost.save();

        res.send({ success: true, message: 'Post created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
});

module.exports = router;

router.get('/login', (req, res) => {
    res.render('login', {
        layout: 'index',
        title: 'Log In',
        data: dataUser
    });
});


router.get('/post/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId).exec();
        
        if (!post) {
            return res.status(404).send('Post not found');
        }

        const comments = await Comment.find({ postID: post.postID }).exec();
        const cleanedComments = comments.map(comment => ({
            _id: comment._id,
            image: comment.image,
            username: comment.username,
            commentDate: comment.commentDate,
            commentText: comment.commentText,
            postID: comment.postID
        }));

        res.render('post', {
            layout: 'index',
            title: 'Post',
            user: req.session.user,
            post: {
                _id: post._id,
                image: post.image,
                title: post.title,
                username: post.username,
                postDate: post.postDate,
                postText: post.postText,
                postID: post.postID
            },
            comments: cleanedComments // Pass the array of comments to the template
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
    
});

router.post('/comment/:id', async (req, res) => {
    const { commentText } = req.body;
    const username = req.session.user;
    const postID = req.params.id;

    if (!username) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).send('User not found');
        }

        const newComment = new Comment({
            image: '../images/user.jpg', // Or the user's profile image if available
            username: user.username,
            commentDate: new Date(),
            commentText,
            postID
        });

        await newComment.save();
        res.status(201).send('Comment posted');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


router.post('/post', async (req, res) => { //this one
    const { title, postText } = req.body;
    const username = req.session.user;
  
    if (!username) {
      return res.status(401).send('Unauthorized');
    }
  
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      const newPost = new Post({
        title,
        postText,
        image: '../images/user.jpg',
        username: user.username,
        postDate: new Date(),
        userID: user.userID,
      });
  
      await newPost.save();
      res.status(201).send('Post created');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });


  router.post('/comment', async (req, res) => {
    const { commentText, postID } = req.body;
    const username = req.session.user;

    if (!username) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).send('User not found');
        }

        const newComment = new Comment({
            image: '../images/user.jpg', // Or the user's profile image if available
            username: user.username,
            commentDate: new Date(),
            commentText,
            postID,
        });

        await newComment.save();
        res.status(201).send('Comment posted');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

  



router.get('/signup', (req, res) => {
    res.render('signup', {
        layout: 'index',
        title: 'Sign Up',
        data: dataUser
    });
});

router.get('/settings', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const username = req.session.user;
    res.render('settings', {
        layout: 'index',
        title: 'Settings',
        data: dataUser
    });
});

router.get('/friends', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    res.render('friends', {
        layout: 'index',
        title: 'Friend List',
        data: dataUser
    });
});

router.get('/profile', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    try {
        const username = req.session.user;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).send('User not found');
        }

        const bio = user.Bio;
        const userID = user.userID;

        // Fetch posts created by the logged-in user
        const userPosts = await Post.find({ username }).exec();
        const cleanedPosts = userPosts.map(post => ({
            _id: post._id,
            image: post.image,
            title: post.title,
            username: post.username,
            postDate: post.postDate,
            postText: post.postText,
            comments: post.comments,
            postID: post.postID
        }));

        res.render('profile', {
            layout: 'index',
            title: 'Profile',
            user: username,
            Bio: bio,
            posts: cleanedPosts // Pass user's posts to the template
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});


router.get('/editprofile', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const username = req.session.user;
    res.render('editprofile', {
        layout: 'index',
        title: 'Edit Profile',
        user: username,
        data: dataUser
    });
});

router.get('/editpost', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const username = req.session.user;
    res.render('editpost', {
        layout: 'index',
        title: 'Edit Post',
        user: username,
        data: dataUser
    });
});

module.exports = router;
