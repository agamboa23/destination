const mongoose = require('mongoose');

const tripSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_id: {type: Number, required: true},
    date_of_trip: {type: Date, required: true},
    date_of_publish: {type: Date, required: true},
    destination: {type: String, required: true},
    members: {type: Array},
    number_of_members: {type: Number},
    last_name: {type: String},
    gender: {type: String},
    age: {type: Number},
    languages: { type: Array},
    profile_id: { type: Number},
    isOpen: {type: Boolean}
});

module.exports = mongoose.model('Trip', tripSchema);