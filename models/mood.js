const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var moodSchema = new Schema({
    user_id: String,
    reason_id: String,
    value: String,
    date_created: {type: Date, default: new Date()},
    date_modified: {type: Date, default: new Date()}
});

module.exports = mongoose.model('Mood', moodSchema);