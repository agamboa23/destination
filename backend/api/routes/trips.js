const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const TripsController = require('../controllers/trips');

router.get('/', TripsController.trips_get_all);
router.get('/upcoming', TripsController.trips_get_all_upcoming);
router.get('/:tripId', TripsController.trips_get_trip);
router.get('/upcoming/:userId', TripsController.trips_get_upcoming_trips_of_user);
router.get('/completed/:userId', TripsController.trips_get_completed_trips_of_user);
router.get('/joinedupcoming/:userId', TripsController.trips_get_joined_upcoming_trips_of_user);
router.get('/joinedcompleted/:userId', TripsController.trips_get_joined_completed_trips_of_user);
router.post('/', TripsController.trips_add_trip);
router.patch('/:tripId', TripsController.trips_update_trip);
router.patch('/cancel/:tripId', TripsController.trips_cancel_trip);
router.patch('/addreq/:tripId/:userId', TripsController.trip_add_request);
router.patch('/accreq/:tripId/:userId', TripsController.trip_accept_request);
router.patch('/rejectreq/:tripId/:userId', TripsController.trip_reject_request);
router.delete('/:tripId', TripsController.trips_delete_trip);
router.delete('/', TripsController.trips_delete_all);


module.exports = router;