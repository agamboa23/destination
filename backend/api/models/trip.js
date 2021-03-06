const mongoose = require('mongoose');

const tripSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date_of_trip: {type: Date},
    date_of_publish: {type: Date},
    origin: { type: String },
    destination: {type: String},
    members: {type: Array},
    requests: {type: Array},
    number_of_members: { type: Number },
    description: { type: String },
    reviews: { type: Array },
    isCancelled: { type: Boolean}
});

module.exports = mongoose.model('Trip', tripSchema);