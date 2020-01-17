import { Router } from 'express';
const router = Router();

import { get_provinces_recommendations, get_districts_recommendations, get_dstn_recommendations } from '../controllers/recommendations';

router.get('/:user_id', get_provinces_recommendations);
router.get('/:user_id/province/:province_osm_id', get_districts_recommendations);
router.get('/:user_id/district/:district_osm_id', get_dstn_recommendations);

export default router;