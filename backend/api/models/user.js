const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {type: String, required: true},
    password: {type: String, required: true},
    first_name: {type: String},
    last_name: {type: String},
    gender: {type: String},
    age: {type: Number},
    languages: { type: Array},
    profile_id: { type: Number}
});

module.exports = mongoose.model('User', userSchema);