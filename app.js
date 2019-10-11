const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const validator = require('express-validator');

const config = require('./config');
const router = require('./routes');

mongoose.connect(config.MONGODB_URL, { userNewUrlParser: true, useCreateIndex: true });

mongoose.connection.on('connected', function mongoListener(err) {
  console.log('Mongodb connected successfully');
});

mongoose.connection.on('error', function mongoErrorListener(err) {
  console.log('Connecting to MongoDB failed!');

  mongoose.connect(config.MONGODB_URL, { userNewUrlParser: true, useCreateIndex: true });
});


var app = express();

app.use(bodyParser.json());
// app.use(validator());
app.use(express.urlencoded({ extended: false }));

router(app);

module.exports = app;
