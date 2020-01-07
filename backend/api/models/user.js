const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: { type: String, required: true },
    password: {type: String, required: true},
    first_name: {type: String},
    last_name: {type: String},
    gender: {type: String},
    age: {type: Number},
    languages: {type: Array},
    trips: {type: Array},
    joined_trips: {type: Array},
    profile_id: {type: Number},
    userImage: {type: String},
    notifications: {type: Array},
    phone_number: {type: String}
});

module.exports = mongoose.model('User', userSchema);