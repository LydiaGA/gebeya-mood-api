const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

require('dotenv').config();
const router = require('./routes');

mongoose.connect(process.env.MONGODB_URL || "mongodb://lydia:mood_pass2@ds339348.mlab.com:39348/db_gebeya_mood",
{ useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

mongoose.connection.on('connected', function mongoListener(err) {
  console.log('Mongodb connected successfully');
});

mongoose.connection.on('error', function mongoErrorListener(err) {
  console.log('Connecting to MongoDB failed!');

  mongoose.connect(process.env.MONGODB_URI || "mongodb://lydia:mood_pass2@ds339348.mlab.com:39348/db_gebeya_mood", 
  { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
});


var app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

router(app);

module.exports = app;
