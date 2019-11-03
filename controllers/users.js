const events = require('events');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const logger = require('heroku-logger')

const UserDal = require('../dal/user');
const config = require('../config');
const searchOptions = require("../lib/search_options");

const teams = ["Student", "Staff", "Talent", "Contractor"];

exports.getTeams = function choices(req, res, next) {
  res.status(200);
  res.json(teams);
};

exports.createUser = function createUser(req, res, next) {
  logger.info("Signup Data ", {body: req.body} )
  let workflow = new events.EventEmitter();

  workflow.on('validateData', function validateData() {

    let validationErrors = validationResult(req);

    if(!validationErrors.isEmpty()) {
      res.status(400);
      res.json(validationErrors.array());
    } else {
      workflow.emit('createUser');
    }
  });

  workflow.on('createUser', function createUser() {
    UserDal.create(req.body, function callback(err, user) {
      if (err) {
        return next(err);
      }

      workflow.emit('respond', user);
    });
  });

  workflow.on('respond', function respond(user) {
    res.status(201);
    res.json(user);
  });

    workflow.emit('validateData');
};

exports.loginUser = function loginUser(req, res, next) {
  logger.info("Login Data ", {body: req.body} )
  let workflow = new events.EventEmitter();

  workflow.on('validateData', function validateData() {

    let validationErrors = validationResult(req);

    if(!validationErrors.isEmpty()) {
      res.status(400);
      res.json(validationErrors.array());
    } else {
      workflow.emit('checkUser');
    }
  });

  workflow.on('checkUser', function checkUser() {
    UserDal.getOne({ email: req.body.email }, function(err, user) {
      if (err) {
        console.log(err);
        return res.status(401).json({
          message: 'Auth Failed'
        });
      }

      workflow.emit('checkPassword', user);
    });
  });

  workflow.on('checkPassword', function checkPassword(user) {
    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if(err) {
        console.log(err);
        return res.status(401).json({
          message: 'Auth Failed'
        });
      }

      if(result) {
        workflow.emit('respond', user);
      }
    });
  });

  workflow.on('respond', function respond(user) {
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id
      },
      config.JWT_KEY,
      {
        expiresIn: "1h"
      }
    );
    res.status(200);
    res.json({
      message: 'Auth Successful',
      user: user,
      token: token
    });
  });

  workflow.emit('validateData');
};

exports.search = function(req, res, next){

  req.query.filter = searchOptions.getFilter(req);

  UserDal.get(req.query.filter, function(err, users) {
    if (err) {
      console.log(err);
      return res.status(404).json({
        message: 'User Not Found'
      });
    }

    res.status(200);
    res.json(users);
  });
}

exports.getUser = function(req, res, next){
  UserDal.getOne({_id : req.params.id}, function(err, user){
    if (err) {
      return res.status(404).json({
        message: 'User Not Found'
      });
    }

    res.status(200);
    res.json(user);
  });
}

exports.profile = function(req, res, next){
  console.log(req.userData.userId);
  UserDal.getOne({_id : req.userData.userId}, function(err, user){
    if (err) {
      return res.status(404).json({
        message: 'User Not Found'
      });
    }

    res.status(200);
    res.json(user);
  });
}

exports.updateProfile = function(req, res, next){
  UserDal.update({_id : req.userData.userId}, req.body, function(err, user){
    if (err) {
      return res.status(404).json({
        message: 'User Not Found'
      });
    }

    res.status(204);
    res.json(user);
  });
}