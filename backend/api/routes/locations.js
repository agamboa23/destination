const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Location = require('../models/location');

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /locations'
    });
});

router.post('/', (req, res, next) => {
    const location = new Location({
        _id: new mongoose.Types.ObjectId(),
        username: req.body.name
    });
    user.save()
        .then(result => {
            console.log(result)
        })
        .catch(err => console.log(err));
    res.status(201).json({
        message: 'Handling POST requests to /locations',
        createdUser: user
    });
});

router.get('/:locationId', (req, res, next) => {
    const id = req.params.userId;
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

router.patch('/:locationId', (req, res, next) => {
        res.status(200).json({
            message: 'Updated location',
        });
});

router.delete('/:locationId', (req, res, next) => {
    res.status(200).json({
        message: 'Deleted location',
    });
})




module.exports = router;