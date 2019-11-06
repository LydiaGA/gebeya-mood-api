const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

require('dotenv').config();
const router = require('./routes');

mongoose.connect(process.env.MONGODB_URL,
{ useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

mongoose.connection.on('connected', function mongoListener(err) {
  console.log('Mongodb connected successfully');
});

mongoose.connection.on('error', function mongoErrorListener(err) {
  console.log('Connecting to MongoDB failed!');

  mongoose.connect(process.env.MONGODB_URL,
  { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
});


var app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

router(app);

module.exports = app;
