const express = require('express');
const server = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const authController = require('./authController');
const mainController = require('./mainController');
const { getData } = require('./UserInfo.js');

// Middleware
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cookieParser());
server.use(session({
    secret: 'Secret123', // Replace with a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using https
}));

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.engine('hbs', handlebars.engine({
    extname: 'hbs',
    defaultLayout: 'index',
    helpers: {
        truncateText: function (text) {
            const words = text.split(' ');
            if (words.length > 10) {
                return words.slice(0, 10).join(' ') + '....';
            }
            return text;
        },
        ifEquals: function(arg1, arg2, options) {
            return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
        }
    }
}));

server.set('view engine', 'hbs');

server.use(express.static('public'));

const port = process.env.PORT || 3000;

server.listen(port, function() {
    console.log('Listening at port ' + port);
});

// Use the controllers
server.use('/', mainController);
server.use('/', authController);
