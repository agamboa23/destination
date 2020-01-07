const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const Trip = require('../models/trip');
const User = require('../models/user');
const Notification = require('../models/notification');

// TODO after trip is deleted remove from user's trips array
// turn delete request to update req for isCancelled

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, //
    requireTLS: false,
    auth: {
        user: 'ddestinnation@gmail.com',
        pass: 'nationdesti15102019'
    },
});

exports.trips_get_all = (req, res, next) => {
    Trip.find()
    .select('user _id origin destination date_of_trip')
    .populate('user', 'user _id first_name')
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            trips: docs.map(doc => {
                return { 
                    _id: doc._id,
                    origin: doc.origin,
                    destination: doc.destination,
                    date: doc.date_of_trip.getFullYear() + "-" + 
                          doc.date_of_trip.getMonth() + "-" +
                          doc.date_of_trip.getDate(),
                    user: doc.user,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/trips/' + doc._id
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

exports.trips_get_all_upcoming_trips = (req, res, next) => {
    const now = new Date();
    Trip.find({ date_of_trip: { $gt: now }, isCancelled: false  }) // added filter
    .select('user _id origin destination date_of_trip')
    .populate('user', 'user _id first_name')
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            trips: docs.map(doc => {
                    return {
                            _id: doc._id,
                            origin: doc.origin,
                            destination: doc.destination,
                            date: doc.date_of_trip.getFullYear() + "-" + 
                                  Number(doc.date_of_trip.getMonth() + 1) + "-" +
                                  doc.date_of_trip.getDate(),
                            user: doc.user
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

exports.trips_get_upcoming_trips_of_user = (req, res, next) => {
    const now = new Date();
    const userId = req.params.userId;
    Trip.find({ date_of_trip: { $gt: now }, user: userId, isCancelled: false })
    .select('user _id origin destination date_of_trip')
    .populate('user', 'user _id first_name')
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            trips: docs.map(doc => {
                    return {
                            _id: doc._id,
                            origin: doc.origin,
                            destination: doc.destination,
                            date_of_trip: doc.date_of_trip.getFullYear() + "-" + 
                                  Number(doc.date_of_trip.getMonth() + 1) + "-" +
                                  doc.date_of_trip.getDate(),
                            user: doc.user,
                            date_of_publish: doc.date_of_publish,
                            members: doc.members,
                            requests: doc.requests,
                            number_of_members: doc.number_of_members,
                            description: doc.description,
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

exports.trips_get_completed_trips_of_user = (req, res, next) => {
    const now = new Date();
    const userId = req.params.userId;
    Trip.find({ date_of_trip: { $lt: now }, user: userId})
    .select('user _id origin destination date_of_trip')
    .populate('user', 'user _id first_name')
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            trips: docs.map(doc => {
                    return {
                            _id: doc._id,
                            origin: doc.origin,
                            destination: doc.destination,
                            date: doc.date_of_trip.getFullYear() + "-" + 
                                  Number(doc.date_of_trip.getMonth() + 1) + "-" +
                                  doc.date_of_trip.getDate(),
                            user: doc.user
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

exports.trips_get_trip = (req, res, next) => {
    Trip.findById(req.params.tripId)
    .populate('user')
    .select('user _id origin destination date_of_trip date_of_publish description members number_of_members requests isCancelled')
    .exec()
    .then(doc => {
        if(!doc) {
            return res.status(404).json({
                message: 'Trip not found'
            });
        }
        res.status(200).json({
            trip: doc,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/trips/'
            }
        });
    })
    .catch(err => {
        console.log(err),
        res.status(500).json({error: err});
    });
};

exports.trips_add_trip = (req, res, next) => {
    const userId = req.body.userId;
    let tripId;
    const today = new Date();
    User.findById(userId)
    .then(user => {
        if(!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        };
        const trip = new Trip({
            _id: new mongoose.Types.ObjectId(),
            user: userId,
            origin: req.body.origin,
            destination: req.body.destination,
            date_of_trip: req.body.date_of_trip,
            date_of_publish: today,
            members: [userId],
            requests: req.body.requests,
            number_of_members: req.body.number_of_members,
            description: req.body.description,
            isCancelled: req.body.isCancelled,
        });
        //sendConfirmation(user, trip);
        tripId = trip._id;
        return trip.save()
                    .then((doc) => 
                        User.findOneAndUpdate(
                            { _id: userId }, 
                            { $addToSet: { trips: [doc._id] } }));
    })
    .then(result => {
        res.status(201).json({
            message: 'Trip saved',
            tripId: tripId,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/trips/'
            }
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err,
        });
    }); 
};

async function sendConfirmation(user, trip){
    let membersNames = [];
    let output;
    console.log(trip.members)
    for(let member of trip.members){
        await User.findById(member, function(err, data){
             return membersNames.push(" " + data.first_name)
        });
    };
    console.log(membersNames.length)
    switch(membersNames.length) {
        case 1:
            output = `<p> You have successfully created a trip</p>
            <h3>Trip details</h3>
            <ul>
                <li>Your trip from ${trip.origin} to ${trip.destination}
                    unfolds on ${trip.date_of_trip}</li>
                <li>At the moment there are no members joining your trip</li>
                <li>If you wish to see more details please use the web app</li>
            </ul>`;
            break;
        case 2:
            output = `<p> You have successfully created a trip</p>
            <h3>Trip details</h3>
            <ul>
                <li>Your trip from ${trip.origin} to ${trip.destination}
                    unfolds on ${trip.date_of_trip}</li>
                <li>At the moment ${membersNames[1]} is joining your trip</li>
                <li>If you wish to see more details please use the web app</li>
            </ul>`;
            break;
        default:
            let lastMember = membersNames.pop();
            output = `<p> You have successfully created a trip</p>
                        <h3>Trip details</h3>
                        <ul>
                            <li>Your trip from ${trip.origin} to ${trip.destination}
                                unfolds on ${trip.date_of_trip}</li>
                            <li>At the moment ${membersNames} and ${lastMember} are joining your trip</li>
                            <li>If you wish to see more details please use the web app</li>
                        </ul>`;
    };     
    let HelperOptions = {
        from: '"Your DestiNation Team" ddestinnation@gmail.com',
        to: user.email,
        subject: 'Trip Confirmation',
        html: output
    };
    transporter.sendMail(HelperOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(200).json({
                error: error
            });
            return;
        };
        console.log("The message was sent!");
        res.status(200).json({
            message: "The message was sent!"
        });
    });
};

// After the user requested to join the trip, adds the user id to trip's requests
// and adds the request notification to the author of the trip
exports.trip_add_request = (req, res, next) => {
    const tripId = req.params.tripId;
    const userId = req.params.userId;
    Trip.update({_id: tripId}, { $addToSet: { requests:  [userId] }})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Trip updated',
            request: {
                 type: 'GET',
                 url: 'http://localhost:3000/trips/' + tripId
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
    makeRequestNotification(tripId, userId);
};

async function makeRequestNotification(tripId, userId){
    let authorId;
    let destination;
    await Trip.findById(tripId, function(err, data){
        authorId = data.user;
        destination = data.destination;
    });
    console.log(authorId);
    const notification = new Notification({
        _id: new mongoose.Types.ObjectId(),
        userId: authorId,
        tripId: tripId,
        memberId: userId,
        date: new Date(),
        type: "request",
        isRead: false,
        message: "You have a new request for your trip to " + destination,
    });
    return notification.save()
                    .then((doc) => 
                        User.findOneAndUpdate(
                            { _id: authorId }, 
                            { $addToSet: { notifications: [doc._id] } }));
};

/*
* After the author accepted the request, removes the user id from trips's requests array
* and adds it to trip's members array, plus makes accept notification for user
*/
exports.trip_accept_request = (req, res, next) => {
    const tripId = req.params.tripId;
    const userId = req.params.userId;
    Trip.update(
        { _id: tripId },
        { $pull: {requests: { $in: [userId] }}, $addToSet: { members: [userId] }})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Trip updated',
            request: {
                 type: 'GET',
                 url: 'http://localhost:3000/trips/' + tripId
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
    makeAcceptNotification(tripId, userId)
};

async function makeAcceptNotification(tripId, userId){
    let authorId;
    let destination;
    await Trip.findById(tripId, function(err, data){
        console.log("unutar: " + data.user);
        authorId = data.user;
        destination = data.destination;
    });
    console.log(authorId);
    await User.findById(authorId, function(err, data){
        console.log(data);
    });
    console.log(authorId);
    const notification = new Notification({
        _id: new mongoose.Types.ObjectId(),
        userId: userId,
        tripId: tripId,
        memberId: authorId,
        date: new Date(),
        type: "acceptance",
        isRead: false,
        message: "Your request to join the trip to " + destination + " was accepted."
    });
    await User.findOneAndUpdate(
        { _id: userId }, 
        { $addToSet: { joined_trips: [tripId] } });
    return notification.save()
                    .then((doc) => 
                        User.findOneAndUpdate(
                            { _id: userId }, 
                            { $addToSet: { notifications: [doc._id] } }));
};

/*
* After the author rejected the request, removes the user id from trips's requests array
* and makes a rejection notification for user
*/
exports.trip_reject_request = (req, res, next) => {
    const tripId = req.params.tripId;
    const userId = req.params.userId;
    Trip.update(
        { _id: tripId },
        { $pull: {requests: { $in: [userId] }}})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Trip updated',
            request: {
                 type: 'GET',
                 url: 'http://localhost:3000/trips/' + tripId
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
    makeRejectionNotification(tripId, userId)
};

async function makeRejectionNotification(tripId, userId){
    let authorId;
    let destination;
    await Trip.findById(tripId, function(err, data){
        console.log("unutar: " + data.user);
        authorId = data.user;
        destination = data.destination;
    });
    const notification = new Notification({
        _id: new mongoose.Types.ObjectId(),
        userId: userId,
        tripId: tripId,
        memberId: authorId,
        date: new Date(),
        type: "rejection",
        isRead: false,
        message: "Your request to join the trip to " + destination + " was rejected."
    });
    return notification.save()
                    .then((doc) => 
                        User.findOneAndUpdate(
                            { _id: userId }, 
                            { $addToSet: { notifications: [doc._id] } }));
};

exports.trips_update_trip = (req, res, next) => {
    res.status(200).json({
        message: 'Updated trip',
    });
};

exports.trips_cancel_trip = (req, res, next) => {
    const tripId = req.params.tripId;
    Trip.findOne({ _id: tripId }, function (err, doc){
        doc.isCancelled = true;
        doc.save();
      });
};

exports.trips_delete_trip = (req, res, next) => {
    const tripId = req.params.tripId;
    Trip.deleteOne({ _id: tripId })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Trip deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/trips/',
            }
        });
    })
    .catch(err => {
        console.log(err),
        res.status(500).json({
            error: err
        });
    });
};

exports.trips_delete_all = (req, res, next) => {
    Trip.deleteMany()
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'All trips deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/trips/',
                body: { userId: 'ID'}
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

