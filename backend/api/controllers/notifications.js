const mongoose = require('mongoose');

const Notification = require('../models/notification');

exports.notifications_get_all = (req, res, next) => {
    Notification.find()
    .select('_id userId tripId type date memberId message')
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            notifications: docs.map(doc => {
                return { 
                    _id: doc._id,
                    type: doc.type,
                    userId: doc.userId,
                    tripId: doc.tripId,
                    memberId: doc.memberId,
                    date: doc.date,
                    message: doc.message,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/notifications/' + doc._id
                    }
                }
            })
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err,
            message: "Ovde"
        });
    });
};

exports.notifications_get_unread_notifications_of_user = (req, res, next) => {
    const userId = req.params.userId;
    Notification.find({ isRead: false, userId: userId})
    .select('user _id ')
    .populate('user', 'user _id first_name')
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            notifications: docs.map(doc => {
                return { 
                    _id: doc._id,
                    type: doc.type,
                    userId: doc.userId,
                    tripId: doc.tripId,
                    date: doc.date,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/notifications/' + doc._id
                    }
                }
            })
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
};

exports.notifications_get_notification = (req, res, next) => {
    let notificationId = req.params.notificationId;
    Notification.findById(notificationId)
    .populate('user')
    .select('_id tripId userId memberId type date isRead message')
    .exec()
    .then(doc => {
        if(!doc) {
            return res.status(404).json({
                message: 'Notification not found'
            });
        }
        doc.isRead = true;
        doc.save();
        res.status(200).json({
            notification: doc,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/notifications/'
            }
        });
    })
    .catch(err => {
        console.log(err),
        res.status(500).json({error: err});
    });
};

async function markAsRead(notificationId){

}

exports.notifications_delete_notification = (req, res, next) => {
    const id = req.params.notificationId;
    Notification.deleteOne({ _id: id })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Notification deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/notifications/',
            }
        });
    })
    .catch(err => {
        console.log(err),
        res.status(500).json({
            error: err
        });
    })
};

exports.notifications_delete_all = (req, res, next) => {
    Notification.deleteMany()
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'All notifications deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/notifications/',
            }
        });
    })
    .catch(err => {
        console.log(err),
        res.status(500).json({
            error: err
        });
    })
};

