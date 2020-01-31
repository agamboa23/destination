const express = require('express');
const router = express.Router();

const ReviewsController = require('../controllers/reviews');

router.get('/', ReviewsController.reviews_get_all);
router.get('/:userId', ReviewsController.reviews_get_reviews_of_user);
router.get('/:reviewId', ReviewsController.reviews_get_review);
router.post('/', ReviewsController.reviews_add_review);
router.delete('/:reviewId', ReviewsController.reviews_delete_review);
router.delete('/', ReviewsController.reviews_delete_all);

module.exports = router;