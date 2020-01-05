const express = require('express');
const router = express.Router();

const ProvincesController = require('../controllers/provinces');

router.get('/:sort_by?/:sort_criteria?/:include_image?', ProvincesController.provinces_get_aggregated);

module.exports = router;