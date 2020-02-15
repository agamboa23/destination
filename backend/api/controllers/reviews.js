const mongoose = require('mongoose');

const Review = require('../models/review');
const Trip = require("../models/trip");
const User = require("../models/user");

exports.reviews_get_all = (req, res, next) => {
    Review.find()
    .select('_id reviewer trip user review date rating')
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            reviews: docs.map(doc => {
                return { 
                    _id: doc._id,
                    reviewer: doc.reviewer,
                    trip: doc.trip,
                    user: doc.user,
                    date: doc.date,
                    review: doc.message,
                    rating: doc.rating,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/reviews/' + doc._id
                    }
                }
            })
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err,
            message: "Ovde"
        });
    });
};

exports.reviews_get_reviews_of_user = (req, res, next) => {
    const userId = req.params.userId;
    Review.find({ userId: userId})
    .select('user _id ')
    .populate('user', 'user _id first_name')
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            reviews: docs.map(doc => {
                return { 
                    _id: doc._id,
                    reviewer: doc.reviewer,
                    user: doc.user,
                    trip: doc.trip,
                    rating: doc.rating,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/reviews/' + doc._id
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

exports.reviews_get_review = (req, res, next) => {
    let reviewId = req.params.reviewId;
    Review.findById(reviewId)
    .populate('user')
    .select('_id trip user reviewer date rating review')
    .exec()
    .then(doc => {
        if(!doc) {
            return res.status(404).json({
                message: 'Review not found'
            });
        }
        res.status(200).json({
            review: doc,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/reviews/'
            }
        });
    })
    .catch(err => {
        console.log(err),
        res.status(500).json({error: err});
    });
};

exports.reviews_add_review = (req, res, next) => {
    User.findById(req.body.user)
      .then(user => {
        if (!user) {
          return res.status(404).json({
            message: "User not found"
          });
        }
        const review = new Review({
          _id: new mongoose.Types.ObjectId(),
          reviewer: req.body.reviewer,
          user: req.body.user,
          trip: req.body.trip,
          date: new Date(),
          review: req.body.review,
          rating: req.body.rating,
        });
        return review
          .save()
        //   .then(doc =>
        //     User.findOneAndUpdate(
        //       { _id: userId },
        //       { $addToSet: { reviews: [doc._id] } }
        //     )
        //   );
      })
      .then(result => {
        res.status(201).json({
          message: "Review saved",
          request: {
            type: "GET",
            url: "http://localhost:3000/reviews/"
          }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  };

exports.reviews_delete_review = (req, res, next) => {
    const reviewId = req.params.reviewId;
    Review.deleteOne({ _id: reviewId })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Reviews deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/reviews/',
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

exports.reviews_delete_all = (req, res, next) => {
    Review.deleteMany()
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'All reviews deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/reviews/',
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

