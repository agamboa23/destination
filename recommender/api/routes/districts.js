const express = require('express');
const router = express.Router();

const DistrictsController = require('../controllers/districts');

router.get('/province/:province_id/:sort_by?/:sort_criteria?/:include_image?/:skip?/:limit?', DistrictsController.districts_get_aggregated);
router.get('/:sort_by?/:sort_criteria?/:include_image?/:skip?/:limit?', DistrictsController.districts_get_aggregated);

module.exports = router;