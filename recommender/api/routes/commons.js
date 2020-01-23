import Router from 'express';
const router = Router();

import { districts_get_aggregated } from '../controllers/commons';

router.get('/commons/images/:locations', districts_get_aggregated);

export default router;