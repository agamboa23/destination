const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: {type: mongoose.Schema.Types.ObjectId},
    tripId: {type: mongoose.Schema.Types.ObjectId},
    memberId: {type: mongoose.Schema.Types.ObjectId},
    date: {type: Date},
    type: {type: String},
    isRead: {type: Boolean},
    message: {type: String}
});

module.exports = mongoose.model('Notification', notificationSchema);