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

exports.create = function create(reasonData, cb) {
  
    var reasonModel = new Reason(reasonData);
  
    reasonModel.save(function saveReason(err, data) {
        if (err) {
            return cb(err);
        }
        exports.getOne({_id: data._id}, function (err, reason) {
            if (err) {
                return cb(err);
            }
            cb(null, reason);
        });
    });
};

exports.getOne = function getOne(query, cb) {

  Reason.findOne(query).exec(function(err, reason) {
    if (err) {
      return cb(err);
    }
    cb(null, reason || {});
  });
};