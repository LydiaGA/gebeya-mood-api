var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');

var indexRouter = require('./routes/');
var usersRouter = require('./routes/users');


mongoose.connect("mongodb://localhost/gebeya_mood", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('error', function errHandler(){
    console.log("Connection Error");  
});

mongoose.connection.once('open', function errHandler(){
    console.log("Connected to Database");  
});


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
