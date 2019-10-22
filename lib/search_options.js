var config = require('../config');

exports.getPage = function (req) {
    return req.query.page ? req.query.page * 1 : 1;
};

exports.getLimit = function (req) {
    if (req.query.limit && req.query.limit < config.MAX_PAGE_SIZE) {
        return req.query.limit * 1;
    }
    return config.MAX_PAGE_SIZE;
};

exports.getSort = function (req) {
    return req.query.sort ? req.query.sort : config.DEFAULT_SORT;
};

exports.getFields = function (req, defaultFields) {
    return req.query.fields ? req.query.fields.split(',').join(' ') : defaultFields.join(' ');
};

exports.getFilter = function (req) {
    return req.query.filter ? JSON.parse(req.query.filter.trim()) : {};
};
