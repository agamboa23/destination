import Router from 'express';
const router = Router();

import * as stereotype from '../controllers/stereotypes';

router.get('/:stereotypes?', stereotype.get_all_stereotypes);

export default router;