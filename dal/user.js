const bcrypt = require("bcrypt");
const User = require("../models/user");

exports.create = function create(userData, cb) {

  bcrypt.hash(userData.password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({
        error: err
      });
    } else {

      userData.password = hash;

      let userModel = new User(userData);

      userModel.save(function saveUser(err, data) {
        if (err) {
          return cb(err);
        }
        exports.getOne({ _id: data._id }, function(err, user) {
          if (err) {
            return cb(err);
          }
          cb(null, user);
        });
      });
    }
  });
};

exports.getOne = function getOne(query, cb) {

  User.findOne(query).exec(function(err, user) {
    if (err) {
      return cb(err);
    }
    cb(null, user || {});
  });
};

exports.get = function get(query, cb) {

  User.find(query).exec(function(err, user) {
    if (err) {
      return cb(err);
    }
    cb(null, user || {});
  });
};
