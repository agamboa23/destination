const express = require('express');
const router = express.Router();

const RecsysController = require('../controllers/recommendations');

router.get('/:user_id', RecsysController.get_provinces_recommendations);
router.get('/:user_id/province/:province_osm_id', RecsysController.get_districts_recommendations);
router.get('/:user_id/district/:district_osm_id', RecsysController.get_dstn_recommendations);

module.exports= router