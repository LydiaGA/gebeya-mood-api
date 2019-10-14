const events = require('events');

const MoodDal = require('../dal/mood');
const config = require('../config');

exports.getChoices = function choices(req, res, next) {

    const choices = ["Happy", "", "Meh", "Fugly", "Angry"];

    res.status(201);
    res.json(choices);
};

exports.saveMood = function saveMood(req, res, next) {
    let workflow = new events.EventEmitter();

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

    workflow.emit('saveMood');
};
