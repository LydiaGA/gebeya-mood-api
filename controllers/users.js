const events = require('events');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

const UserDal = require('../dal/user');
const config = require('../config');

exports.createUser = function createUser(req, res, next) {
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
        return res.status(401).json({
          message: 'Auth Failed'
        });
      }

      workflow.emit('checkPassword', user);
    })
  });

  workflow.on('checkPassword', function checkPassword(user) {
    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if(err) {
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
