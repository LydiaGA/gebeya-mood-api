const events = require('events');
const { check, validationResult } = require('express-validator');

const MoodDal = require('../dal/mood');
const config = require('../config');
const searchOptions = require("../lib/search_options");

const moodChoices = ["Happy", "Content", "Neutral", "Sad", "Angry"];

var defaultFields = ['user', 'reason', 'value', 'date_created', 'date_modified'];

exports.getChoices = function choices(req, res, next) {

    MoodDal.getChoices(function(err, result){
        if (err) {
            return next(err);
        }

        res.status(201);
        res.json(result);
    });   
};

exports.saveMood = function saveMood(req, res, next) {
    let workflow = new events.EventEmitter();

    workflow.on('validateData', function validateData() {

        let validationErrors = validationResult(req);
    
        if(!validationErrors.isEmpty()) {
          res.status(400);
          res.json(validationErrors.array());
        } else {
          workflow.emit('saveMood');
        }
      });

    workflow.on('saveMood', function saveMood() {
        req.body.user = req.userData.userId;
        MoodDal.create(req.body, function callback(err, mood) {
            if (err) {
                return next(err);
            }

            workflow.emit('respond', mood);
        });
    });

    workflow.on('respond', function respond(mood) {
        res.status(201);
        res.json(mood);
    });

    workflow.emit('validateData');
};

exports.getMoods = function getMoods(req, res, next) {
    var workflow = new events.EventEmitter();

    req.query.filter = searchOptions.getFilter(req);
    req.query.fields = searchOptions.getFields(req, defaultFields);
    req.query.page = searchOptions.getPage(req);
    req.query.limit = searchOptions.getLimit(req);
    req.query.sort = searchOptions.getSort(req);

    workflow.on('validateQuery', function validateSearchQuery() {

        let validationErrors = validationResult(req);
    
        if(!validationErrors.isEmpty()) {
          res.status(400);
          res.json(validationErrors.array());
        } else {
          workflow.emit('searchMoods');
        }
    });

    workflow.on('searchMoods', function getMoods() {
        var opts = {
            filter: req.query.filter,
            fields: req.query.fields,
            sort: req.query.sort,
            limit: req.query.limit,
            page: req.query.page
        };

        MoodDal.search(opts, function (err, moods) {
            if (err) {
                return next(err);
            }

            workflow.emit('respond', moods);
        });
    });

    workflow.on('respond', function respond(moods) {
        res.status(200);
        res.json(moods);
    });

    workflow.emit('validateQuery');
};

exports.getMoodCount = function getMoodCount(req, res, next) {
    var workflow = new events.EventEmitter();

    req.query.filter = searchOptions.getFilter(req);

    workflow.on('validateQuery', function validateSearchQuery() {

        let validationErrors = validationResult(req);

        console.log(req.query.filter.user != req.userData.userId);
        console.log(req.query.filter.user != null);
        console.log(req.userData.role == "basic");
    
        if(!validationErrors.isEmpty()) {
          res.status(400);
          res.json(validationErrors.array());
        }else if((req.query.filter.user != null && req.query.filter.user != req.userData.userId) && req.userData.role == "basic"){
            res.status(401);
            res.json({
                error: "You don't have enough permission to perform this action"
               });
        } else {
          workflow.emit('getCount');
        }
    });

    workflow.on('getCount', function getMoods() {
        filter = req.query.filter;

        MoodDal.moodCountAllTypes(filter, function (err, result) {
            if (err) {
                return next(err);
            }

            workflow.emit('respond', result);
        });
    });

    workflow.on('respond', function respond(result) {
        res.status(200);
        res.json(result);
    });

    workflow.emit('validateQuery');
};

exports.myLogs = function myLogs(req, res, next){
    var workflow = new events.EventEmitter();

    workflow.on('validateQuery', function validateSearchQuery() {

        let validationErrors = validationResult(req);
    
        if(!validationErrors.isEmpty()) {
          res.status(400);
          res.json(validationErrors.array());
        } else {
          workflow.emit('getLogs');
        }
    });

    workflow.on('getLogs', function getLogs(){
        var filter = JSON.parse(req.query.filter);
        filter.user = req.userData.userId;
        req.query.filter = JSON.stringify(filter);
        exports.getMoods(req, res, next);
    });

    workflow.emit('validateQuery');
    
}

exports.myMoodCount = function myMoodCount(req, res, next){
    var workflow = new events.EventEmitter();

    workflow.on('validateQuery', function validateSearchQuery() {

        let validationErrors = validationResult(req);
    
        if(!validationErrors.isEmpty()) {
          res.status(400);
          res.json(validationErrors.array());
        } else {
          workflow.emit('getCount');
        }
    });

    workflow.on('getCount', function getLogs(){
        var filter = JSON.parse(req.query.filter);
        filter.user = req.userData.userId;
        req.query.filter = JSON.stringify(filter);
        exports.getMoods(req, res, next);
    });

    workflow.emit('validateQuery');
}


