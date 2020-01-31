const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: { type: String, required: true },
    password: {type: String, required: true},
    first_name: {type: String},
    last_name: {type: String},
    phone_number: {type: String},
    gender: {type: String},
    age: {type: Number},
    date_joined: {type: Date},
    bio: {type: String},
    education: {type: String},
    home_town: {type: String},
    friends: {type: Array},
    interests: {type: Array},
    languages: {type: Array},
    trips: {type: Array},
    joined_trips: {type: Array},
    profile_id: {type: Number},
    isVerified: {type: Boolean},
    userImage: {type: String},
    notifications: {type: Array},
    badges: {type: Array},
    last_login: {type: Date},
    reviews: { type: Array }
});

module.exports = mongoose.model('User', userSchema);