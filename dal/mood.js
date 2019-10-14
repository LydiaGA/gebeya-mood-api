const Mood = require("../models/mood");

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
