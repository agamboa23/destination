const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.users_signup = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if(user.length >= 1) {
                return res.status(409).json({
                    message: 'Mail exists'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if(err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash,
                            first_name: req.body.first_name,
                            last_name: req.body.last_name,
                            gender: req.body.gender,
                            age: req.body.age,
                            languages: req.body.languages,
                            trips: req.body.trips
                        });
                        user.save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'User created'
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                })
                            });
                    }
                });
            }
        });
};

exports.users_login = (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if(user.length < 1) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    });
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id
                        },
                        "destination", 
                        {
                            expiresIn: "1h"
                        }
                    );
                    return res.status(200).json({
                        message: 'Login successful',
                        token: token,
                        userId: user[0]._id
                    });
                }
                return res.status(401).json({
                    message: 'Login failed'
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.users_get_all = (req, res, next) => {
    User.find()
    .select('first_name _id ') //userImage')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            users: docs.map(doc => {
                return {
                    first_name: doc.first_name,
                    _id: doc._id,
                    userImage: doc.userImage,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/users/' + doc._id
                    }
                }
            })
        };
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

exports.users_get_user =  (req, res, next) => {
    const id = req.params.userId;
    User.findById(id)
    .select('email first_name _id last_name gender age languages trips')
    .exec()
    .then(doc => {
        if(doc){
            res.status(200).json({
                user: doc,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/users/'
                }
            });
        } else {
            res.status(404).json({message: 'No valid entry found '});
        }
    })
    .catch(err => {
        console.log(err),
        res.status(500).json({error: err});
    });
};

exports.users_patch_user =  (req, res, next) => {
    const id = req.params.userId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value
    };
    User.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'User updated',
            request: {
                 type: 'GET',
                 url: 'http://localhost:3000/users/' + id
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
};

exports.users_delete_user =  (req, res, next) => {
    const id = req.params.userId;
    User.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'User deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/users/',
                body: { first_name: 'String'}
            }
        })
    })
    .catch(err => {
        res.status(400).json({
            error: err
        });
    });
};

exports.users_delete_all =  (req, res, next) => {
    User.deleteMany()
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'All users deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/users/',
                body: { first_name: 'String'}
            }
        })
    })
    .catch(err => {
        res.status(400).json({
            error: err
        });
    });
};