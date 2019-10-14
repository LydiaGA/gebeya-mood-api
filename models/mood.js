const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var moodSchema = new Schema({
    user: {type: mongoose.SchemaTypes.ObjectId, ref: 'User'},    // Use reference to user Schema instead of just a string
    reason: {type: mongoose.SchemaTypes.ObjectId, ref: 'Reason'},
    value: String
},{
    timestamps: {createdAt: "date_created", updatedAt: "date_modified"}
});

module.exports = mongoose.model('Mood', moodSchema);