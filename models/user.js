const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema({
    name: String,
    email: String,
    sex: String,
    username: String,
    password: String,
    type: String,
    isAdmin: Boolean,
    date_created: {type: Date, default: new Date()},
    date_modified: {type: Date, default: new Date()}
});

module.exports = mongoose.model('User', userSchema);