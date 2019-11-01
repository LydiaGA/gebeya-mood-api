const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password:  {type: String, required: true},  
    sex: {type: String, required: true},
    team:  {type: String, required: true},
    role : {type: String, enum : ['basic', 'admin'], default : 'basic'}
}, {
    timestamps: {createdAt: "date_created", updatedAt: "date_modified"}
});

module.exports = mongoose.model('User', userSchema);
