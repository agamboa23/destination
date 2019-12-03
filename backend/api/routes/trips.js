const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const Trip = require('../models/trip');
const User = require('../models/user');

router.get('/', (req, res, next) => {
    Trip.find()
    .select('user _id')
    .populate('user', 'user _id')
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            trips: docs.map(doc => {
                return { 
                    _id: doc._id,
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
});

router.post('/', checkAuth, (req, res, next) => {
    User.findById(req.body.userId)
    .then(user => {
        if(!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        const trip = new Trip({
            _id: new mongoose.Types.ObjectId(),
            user: req.body.userId,
            destination: req.body.destination
        });
        return trip.save();
    })
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Trip saved',
            createdTrip: {
                _id: result._id,
                user: result.user,
            },
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
});

router.get('/:tripId', (req, res, next) => {
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
});

router.patch('/:tripId',checkAuth, (req, res, next) => {
        res.status(200).json({
            message: 'Updated trip',
        });
});

router.delete('/:tripId',checkAuth, (req, res, next) => {
    Trip.remove({ _id: req.params.tripId })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Trip deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/trips',
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
});




module.exports = router;