const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var moodSchema = new Schema({
    user: {type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true},
    reason: {type: mongoose.SchemaTypes.ObjectId, ref: 'Reason', required: true},
    value: {type: String, required: true}
},{
    timestamps: {createdAt: "date_created", updatedAt: "date_modified"}
});

module.exports = mongoose.model('Mood', moodSchema);