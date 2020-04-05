import Router from 'express';
const router = Router();

import * as profiler from '../controllers/profiler';

router.get('/is_new_profile/:profile_id?', profiler.is_new_profile);
router.post('/build_profile', profiler.build_profile);

export default router;