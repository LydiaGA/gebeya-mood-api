const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    email: String,
    sex: String,
    username: String,
    password: String,
    type: String,
    isAdmin: Boolean,
}, {
    timestamps: {createdAt: 'date_created', updatedAt: 'date_modified'}
});

module.exports = mongoose.model('User', userSchema);