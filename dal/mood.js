const Mood = require("../models/mood");
const User = require("../models/user");

exports.create = function create(moodData, cb) {
  
  var moodModel = new Mood(moodData);

  moodModel.save(function saveMood(err, data) {
      if (err) {
          return cb(err);
      }
      exports.getOne({_id: data._id}, function (err, mood) {
          if (err) {
              return cb(err);
          }
          cb(null, mood);
      });
  });
};

exports.getOne = function getOne(query, cb) {

  Mood.findOne(query).exec(function(err, mood) {
    if (err) {
      return cb(err);
    }
    cb(null, mood || {});
  });
};

exports.get = function search(options, cb){

  Mood.find(options.filter, options.fields)
  .sort(options.sort)
  .limit(options.limit)
  .skip(options.limit * (options.page - 1))
  .exec(function searchMoods(err, moods) {
      if(err) {
          return cb(err);
      }
      return cb(null, moods);
  });
}

exports.getByUserType = function getByUserType(userType, options, cb){ 

  User.find({type : userType}, "_id", function(err, users){
    if(err){
      return cb(err);
    }

    options.filter.user = { $in: users};

    exports.get(options, function(err, moods){
      if(err){
        return cb(err);
      }

      cb(null, moods);
    });
  });
}

exports.search = function search(options, cb){
  if(options.filter.userType != null){ 
    var userType = options.filter.userType;
    options.filter.userType = null;

    exports.getByUserType(userType, options, function(err, moods){
      if(err){
        return cb(err);
      }

      cb(null, moods);
    });
  }else{
    exports.get(options,  function(err, moods){
      if(err){
        return cb(err);
      }

      cb(null, moods);
    });
  }
}

exports.count = function count(filter, cb){
  Mood.countDocuments(filter, function(err, c){
    if(err){
      return cb(err);
    }

    cb(null, c);
  });
}

exports.countByUserType = function countByUserType(userType, filter, cb){
  User.find({type : userType}, "_id", function(err, users){
    if(err){
      return cb(err);
    }

    filter.user = { $in: users};

    exports.count(filter, function(err, c){
      if(err){
        return cb(err);
      }
      cb(null, c);
    });
  });
}

exports.moodCount = function moodCount(filter, cb){
  if(filter.userType != null){ 
    var userType = filter.userType;
    filter.userType = null;

    exports.countByUserType(userType, filter, function(err, c){
      if(err){
        return cb(err);
      }
  
      cb(null, c);
    });
    
  }else{
    exports.count(filter, function(err, c){
      if(err){
        return cb(err);
      }  
      cb(null, c);
    });
  }
}

