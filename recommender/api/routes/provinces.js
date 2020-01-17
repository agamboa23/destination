import { Router } from 'express';
const router = Router();

import { provinces_get_aggregated } from '../controllers/provinces';

router.get('/:sort_by?/:sort_criteria?/:include_image?', provinces_get_aggregated);

export default router;