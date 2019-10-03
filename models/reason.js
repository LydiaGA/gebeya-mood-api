const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var reasonSchema = new Schema({
    title: String,
    type: String,
    date_created: {type: Date, default: new Date()},
    date_modified: {type: Date, default: new Date()}
});

module.exports = mongoose.model('Reason', reasonSchema);