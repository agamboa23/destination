const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Profile = require('../models/profile');

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /profiles'
    });
});

router.post('/', (req, res, next) => {
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        username: req.body.name
    });
    user.save()
        .then(result => {
            console.log(result)
        })
        .catch(err => console.log(err));
    res.status(201).json({
        message: 'Handling POST requests to /users',
        createdUser: user
    });
});

router.get('/:userId', (req, res, next) => {
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

router.patch('/:userId', (req, res, next) => {
        res.status(200).json({
            message: 'Updated user',
        });
});

router.delete('/:userId', (req, res, next) => {
    res.status(200).json({
        message: 'Deleted user',
    });
})




module.exports = router;