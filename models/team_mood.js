const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var teamMoodSchema = new Schema({
    team_name: {type: String, required: true},
    team_total: {type: String, required: true},
    mood: {type: String, required: true}
},{
    timestamps: {createdAt: "date_created", updatedAt: "date_modified"}
});

module.exports = mongoose.model('TeamMood', teamMoodSchema);