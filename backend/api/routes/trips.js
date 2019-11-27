const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Trip = require('../models/trip');

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /trips'
    });
});

router.post('/', (req, res, next) => {
    const trip = new Trip({
        _id: new mongoose.Types.ObjectId(),
        user_id: req.body.user_id,

    });
    trip.save()
        .then(result => {
            console.log(result)
        })
        .catch(err => console.log(err));
    res.status(201).json({
        message: 'Handling POST requests to /trips',
        createdTrip: trip
    });
});

router.get('/:tripId', (req, res, next) => {
    const id = req.params.tripId;
    User.findById(id)
    .exec()
    .then(doc => {
        console.log(doc);
        res.status(200).json(doc);
    })
    .catch(err => {
        console.log(err),
        res.status(500).json({error: err});
    });
});

router.patch('/:tripId', (req, res, next) => {
        res.status(200).json({
            message: 'Updated trip',
        });
});

router.delete('/:tripId', (req, res, next) => {
    res.status(200).json({
        message: 'Deleted trip',
    });
})




module.exports = router;