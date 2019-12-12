const Mood = require("../models/mood");
const User = require("../models/user");
const Reason = require("../models/reason");

const searchOptions = require("../lib/search_options");

const graphLabels = {
  day : [0, 4, 8, 12, 16, 20, 24],
  month: [1, 6, 12, 18, 25, 30],
  year: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
};

exports.getChoices = function getChoices(cb){
  Reason.find({type : "Happy"}, function(err, reasons){
    let result = {};
    result.Happy = reasons;

    Reason.find({type : "Content"}, function(err, reasons){
      result.Content = reasons;

      Reason.find({type : "Neutral"}, function(err, reasons){
        result.Neutral = reasons;

        Reason.find({type: "Sad"}, function(err, reasons){
          result.Sad = reasons;

          Reason.find({type : "Angry"}, function(err, reasons){
            result.Angry = reasons;

            if(err){
              return cb(err);
            }

            cb(null, result);
          });
        });
      });
    });
  });
}

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

  Mood.findOne(query)
  .populate(['reason', 'user'])
  .exec(function(err, mood) {
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
  .populate(['reason', 'user'])
  .exec(function searchMoods(err, moods) {
      if(err) {
          return cb(err);
      }
      return cb(null, moods);
  });
}

exports.getByTeam = function getByUserTeam(team, options, cb){ 

  User.find({team : team}, "_id", function(err, users){
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
  if(options.filter.team != null){ 
    var team = options.filter.team;
    options.filter.team = null;

    exports.getByTeam(team, options, function(err, moods){
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

exports.count = async function count(filter){
  var countFilter = { ...filter };
  delete countFilter.date;
  delete countFilter.team;
  const count = await Mood.countDocuments(countFilter);
  return count;
}

exports.countByTeam = async function countByTeam(team, filter, cb){
  const users = await User.find({team : team}, "_id");

  filter.user = { $in: users};

  const count = await exports.count(filter);
  return count;
}

exports.moodCount = async function moodCount(filter){
  var count = 0;
  if(filter.team != null){ 
    var team = filter.team;
    filter.team = null;

    count = await exports.countByTeam(team, filter);
    
  }else{
    count = await exports.count(filter);
  }

  return count;
}

exports.moodCountAllTypes = async function moodCountAllTypes(filter){
  filter.value = "Happy";
  let result = {};

  result.Happy = await exports.moodCount(filter);

  filter.value = "Content";
  result.Content = await exports.moodCount(filter);
  
  filter.value = "Neutral";
  result.Neutral = await exports.moodCount(filter);

  filter.value = "Sad";
  result.Sad = await exports.moodCount(filter);
  
  filter.value = "Angry";
  result.Angry = await exports.moodCount(filter);

  return result;

}

exports.graph = async function getGraph(filter){
  var labels = graphLabels[filter.date.timeUnit];
  var date = new Date(filter.date.date);
  var result = {};
  let countFilter = {};
  for(var i = 0; i < labels.length; i++){
    countFilter = JSON.parse(JSON.stringify(filter));
    if(countFilter.date.timeUnit == 'day'){ // add time
      countFilter.date.date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), labels[i], 0, 0);
    }else if(countFilter.date.timeUnit == 'month'){
      countFilter.date.date = new Date(date.getFullYear(), date.getMonth(), labels[i], 0, 0, 0);
      countFilter.date.timeUnit = 'day';
    }else{
      countFilter.date.date = new Date(date.getFullYear(), labels[i], 1, 0, 0, 0);
      countFilter.date.timeUnit = 'month';
    }

    console.log(filter.date.timeUnit);
    var dateInterval = searchOptions.getDateInterval(countFilter.date);
    console.log(countFilter.date.date);
    console.log(date);
    countFilter.date_modified = {"$gte": dateInterval.start, "$lt": dateInterval.end};
    result[labels[i]] = await exports.moodCountAllTypes(countFilter);
  }

  return result;
}


exports.deleteMood = function deleteMood(query, cb){

  Mood.findOneAndDelete(query).exec(function(err, mood){
    if (err) {
      return cb(err);
    }
    cb(null, mood || {});
  });
}


