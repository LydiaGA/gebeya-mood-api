const Reason = require("../models/reason");

exports.get = function get(query, cb) {

    Reason
    .find(query)
    .exec(function (err, reasons) {
        if (err) {
            return cb(err);
        }
        cb(null, reasons || []);
    });
};