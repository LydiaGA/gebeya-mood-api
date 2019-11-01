const events = require('events');
const { check, validationResult } = require('express-validator');

const TeamMoodDal = require('../dal/team_mood');
const config = require('../config');
const searchOptions = require("../lib/search_options");

var defaultFields = ['name', 'total', 'mood', 'date_created', 'date_modified'];

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
        TeamMoodDal.create(req.body, function callback(err, mood) {
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

exports.getTeamMoods = function getTeamMoods(req, res, next) {
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

        TeamMoodDal.get(opts, function (err, moods) {
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

exports.updateTeamMood = function updateTeamMood(req, res, next){
    TeamMoodDal.update({_id : req.params.id}, req.body, function(err, user){
      if (err) {
        return res.status(404).json({
          message: 'User Not Found'
        });
      }
  
      res.status(204);
      res.json(user);
    });
  }
