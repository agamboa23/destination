import Router from 'express';
const router = Router();

import * as RecSys from '../controllers/recommendations';

router.get('/:user_id', RecSys.get_provinces_recommendations);
router.get('/:user_id/province/:province_osm_id', RecSys.get_districts_recommendations);
router.get('/:user_id/district/:district_osm_id', RecSys.get_dstn_recommendations);
router.get('/stereotypes/:stereotypes/destinations', RecSys.get_dstn_by_stereotype);

export default router;