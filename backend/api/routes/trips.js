const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const TripsController = require('../controllers/trips');
const UsersController = require('../controllers/users');

//After POST request send a PATCH request to Users to update field trips of users
// with the id of created trip

router.get('/', TripsController.trips_get_all);
router.post('/', TripsController.trips_add_trip);
router.get('/:tripId', TripsController.trips_get_trip);
router.patch('/:tripId', TripsController.trips_update_trip);
router.patch('/addreq/:tripId/:userId', TripsController.trip_add_request);
router.patch('/accreq/:tripId/:userId', TripsController.trip_accept_request);
router.delete('/:tripId/:userId', TripsController.trips_delete_trip);

module.exports = router;