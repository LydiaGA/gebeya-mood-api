const events = require('events');
const { check, validationResult } = require('express-validator');

const ReasonDal = require('../dal/reason');
const config = require('../config');

exports.getReasons = function getReasons(req, res, next) {
    let workflow = new events.EventEmitter();

    workflow.on('getReasons', function getReasons() {
        ReasonDal.get({type : req.params.type}, function callback(err, reasons) {
            if (err) {
                return next(err);
            }

            workflow.emit('respond', reasons);
        });
    });

    workflow.on('respond', function respond(reasons) {
        res.status(200);
        res.json(reasons);
    });

    workflow.emit('getReasons');
};

exports.saveReason = function saveReason(req, res, next) {
    let workflow = new events.EventEmitter();

    workflow.on('validateData', function validateData() {

        let validationErrors = validationResult(req);
    
        if(!validationErrors.isEmpty()) {
          res.status(400);
          res.json(validationErrors.array());
        } else {
          workflow.emit('saveReason');
        }
      });

    workflow.on('saveReason', function saveReason() {
        ReasonDal.create(req.body, function callback(err, reason) {
            if (err) {
                return next(err);
            }

            workflow.emit('respond', reason);
        });
    });

    workflow.on('respond', function respond(reason) {
        res.status(201);
        res.json(reason);
    });

    workflow.emit('validateData');
};

