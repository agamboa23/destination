import Router from 'express';
const router = Router();

import { districts_get_aggregated } from '../controllers/districts';

router.get('/province/:province_id/:sort_by?/:sort_criteria?/:include_image?/:skip?/:limit?', districts_get_aggregated);
router.get('/:sort_by?/:sort_criteria?/:include_image?/:skip?/:limit?', districts_get_aggregated);

export default router;