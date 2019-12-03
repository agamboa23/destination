const Trip = require('../models/trip');
const User = require('../models/user');

exports.trips_get_all = (req, res, next) => {
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
};

exports.trips_add_trip = (req, res, next) => {
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
};
