const events = require('events');

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
