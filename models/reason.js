const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var reasonSchema = new Schema({
    title: {type: String, required: true},
    type: {type: String, required: true}
}, {
    timestamps: {createdAt: "date_created", updatedAt: "date_modified"}
});

module.exports = mongoose.model('Reason', reasonSchema);