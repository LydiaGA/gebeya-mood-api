const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var reasonSchema = new Schema({
    title: String,
    type: String
}, {
    timestamps: {createdAt: "date_created", updatedAt: "date_modified"}
});

module.exports = mongoose.model('Reason', reasonSchema);