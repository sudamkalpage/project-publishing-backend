/*jshint esversion: 8 */
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

//connect to database
const url = 'mongodb://localhost/project_publishing_db';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const con = mongoose.connection;
con.on('open', () => {
    console.log("connected .. ");
});

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use('static', express.static('static'));

//define middlewares
const usersRoute = require('./routes/users')
app.use('/users',usersRoute)

//Error handling
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app