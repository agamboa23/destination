const mongoose = require('mongoose');

const Trip = require('../models/trip');
const User = require('../models/user');

exports.trips_get_all = (req, res, next) => {
    Trip.find()
    .select('user _id origin destination date_of_trip')
    .populate('user', 'user _id')
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

exports.trips_get_trip = (req, res, next) => {
    Trip.findById(req.params.tripId)
    .populate('user')
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
        }
        const trip = new Trip({
            _id: new mongoose.Types.ObjectId(),
            user: userId,
            origin: req.body.origin,
            destination: req.body.destination,
            date_of_trip: req.body.date_of_trip,
            date_of_publish: today,
            members: req.body.members,
            number_of_members: req.body.number_of_members,
            isOpen: req.body.isOpen
        });
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

// After the user requested to join the trip, adds the user id to trip's requests
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
    
};

exports.trips_update_trip = (req, res, next) => {
    res.status(200).json({
        message: 'Updated trip',
    });
};

exports.trips_delete_trip = (req, res, next) => {
    Trip.remove({ _id: req.params.tripId })
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
    });
};