/*jshint esversion: 8 */

const express = require('express');
const mongoose = require('mongoose');
// const morgan = require('morgan');

const url = 'mongodb://localhost/project_publishing_db';

const app = express();

//connect to database
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const con = mongoose.connection;

con.on('open', () => {
    console.log("connected .. ");
});

app.use(express.json());
// app.use(morgan('dev'));
app.use('static', express.static('static'));

//define middlewares
// const markerRoutes = require('./routes/markers');
// app.use('/marker', markerRoutes);

// const teachersRoutes = require('./routes/teachers');
// app.use('/teachers', teachersRoutes);

// const parentsRoutes = require('./routes/parents');
// app.use('/parents', parentsRoutes);

// const paperlistsRoutes = require('./routes/paperlists');
// app.use('/paperlists', paperlistsRoutes);

const usersRoute = require('./routes/users')
app.use('/users',usersRoute)

// const papersRoute = require('./routes/papers')
// app.use('/papers',papersRoute)
// const submissionsRoute = require('./routes/submissions')
// app.use('/submissions',submissionsRoute)

// const markerPaperListRoutes= require('./routes/marker_paperlists');
// app.use('/marker_paperlist',markerPaperListRoutes);

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

//start server in port 9000
app.listen(9000, () => {
    console.log('Server started');
});
