const events = require('events');
const { check, validationResult } = require('express-validator');

const MoodDal = require('../dal/mood');
const config = require('../config');

const moodChoices = ["Happy", "Content", "Neutral", "Sad", "Angry"];

exports.getChoices = function choices(req, res, next) {
    res.status(201);
    res.json(moodChoices);
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
