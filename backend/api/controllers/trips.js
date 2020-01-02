const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const Trip = require('../models/trip');
const User = require('../models/user');
const Notification = require('../models/notification');

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
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
    Trip.find({ date_of_trip: { $gt: now } })
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
    Trip.find({ date_of_trip: { $gt: now }, user: userId})
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
    .select('user _id origin destination date_of_trip date_of_publish description members number_of_members requests')
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
            members: req.body.members,
            requests: req.body.requests,
            number_of_members: req.body.number_of_members,
            description: req.body.description
        });
        sendConfirmation(user, trip);
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
    for(let member of trip.members){
        await User.findById(member, function(err, data){
             return membersNames.push(" " + data.first_name)
        });
    };
    switch(membersNames.length) {
        case 0:
            output = `<p> You have successfully created a trip</p>
            <h3>Trip details</h3>
            <ul>
                <li>Your trip from ${trip.origin} to ${trip.destination}
                    unfolds on ${trip.date_of_trip}</li>
                <li>At the moment there are no members joining your trip</li>
                <li>If you wish to see more details please use the web app</li>
            </ul>`;
            break;
        case 1:
            output = `<p> You have successfully created a trip</p>
            <h3>Trip details</h3>
            <ul>
                <li>Your trip from ${trip.origin} to ${trip.destination}
                    unfolds on ${trip.date_of_trip}</li>
                <li>At the moment ${membersNames} is joining your trip</li>
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
* and adds it to trip's members array
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


// TODO: make notification and add it to the accepted user's notifications
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

exports.trips_delete_trip = (req, res, next) => {
    const id = req.params.tripId;
    Trip.deleteOne({ _id: id })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Trip deleted',
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

