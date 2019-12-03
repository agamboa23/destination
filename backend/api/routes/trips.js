const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const Trip = require('../models/trip');
const User = require('../models/user');

const TripsController = require('../controllers/trips');

router.get('/', TripsController.trips_get_all);
router.post('/', checkAuth, TripsController.trips_add_trip);

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