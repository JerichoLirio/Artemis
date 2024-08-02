const express = require('express');
const router = express.Router();
const { User, Post } = require('./db');

router.post('/signup', async (req, res) => {
    const { name, password, confirm_password } = req.body;

    if (password !== confirm_password) {
        return res.status(400).send('Passwords do not match');
    }

    try {
        const existingUser = await User.findOne({ username: name });
        if (existingUser) {
            return res.status(400).send('Username already exists');
        }

        // Find the highest existing userID
        const lastUser = await User.findOne().sort({ userID: -1 }).exec();
        const newUserID = lastUser ? lastUser.userID + 1 : 1; // Start from 1 if no users exist

        // Create the new user with the incremented userID
        await User.create({ username: name, password, userID: newUserID });

        req.session.user = name;
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

router.post('/login', async (req, res) => {
    const { name, password } = req.body;

    try {
        const existingUser = await User.findOne({ username: name });
        if (!existingUser || existingUser.password !== password) {
            return res.status(400).send('Invalid username or password');
        }

        req.session.user = name;
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Failed to log out');
        }
        res.redirect('/');
    });
});

router.post('/updateBio', async (req, res) => {
    const { Bio } = req.body; 
    const username = req.session.user;

    if (!username) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const user = await User.findOneAndUpdate({ username: username }, { Bio: Bio }, { new: true });
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.redirect('/profile');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

router.post('/updateUser', async (req, res) => {
    const { newUsername } = req.body;
    const username = req.session.user;

    if (!username) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const existingUser = await User.findOne({ username: newUsername });
        if (existingUser) {
            return res.status(400).send('Username already exists');
        }

        const user = await User.findOneAndUpdate({ username: username }, { username: newUsername }, { new: true });
        if (!user) {
            return res.status(404).send('User not found');
        }

        req.session.user = newUsername;
        res.redirect('/profile');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
