const TeamMood = require("../models/team_mood");
const User = require("../models/user");
const Reason = require("../models/reason");

exports.create = function create(moodData, cb) {
  
  var moodModel = new TeamMood(moodData);

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

TeamMood.findOne(query)
  .exec(function(err, mood) {
    if (err) {
      return cb(err);
    }
    cb(null, mood || {});
  });
};

exports.get = function search(options, cb){

TeamMood.find(options.filter, options.fields)
  .sort(options.sort)
  .limit(options.limit)
  .skip(options.limit * (options.page - 1))
  .exec(function searchMoods(err, moods) {
      if(err) {
          return cb(err);
      }
      console.log(moods);
      return cb(null, moods);
  });
}

exports.update = function update(query, update, cb){

    TeamMood.findOneAndUpdate(query, update, {useFindAndModify : false}).exec(function(err, mood){
      if (err) {
        return cb(err);
      }
      cb(null, mood || {});
    });
  }