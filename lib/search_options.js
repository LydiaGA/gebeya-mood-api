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
    if(req.query.filter != null){
        var filter = JSON.parse(req.query.filter.trim());
        if(filter.date){
            var dateInterval = exports.getDateInterval(filter.date);
            filter.date_modified = {"$gte": dateInterval.start, "$lt": dateInterval.end};
        }       
        return filter;  
    }else{
        return {};
    }
};

exports.getDateInterval = function getDateInterval(date){
    var timeUnit = date.timeUnit;
    var date = new Date(date.date);
    
    var start, end;

    switch(timeUnit){
        case "day":
            start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
            end = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
            break;
        case "month":
            start = new Date(date.getFullYear(), date.getMonth(), 1);
            end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            break;
        case "year":
            start = new Date(date.getFullYear(), 0, 1);
            end = new Date(date.getFullYear(), 12, 0);
            break;
    }

    return {
        start : start,
        end: end
    }
}