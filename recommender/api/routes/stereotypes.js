import Router from 'express';
const router = Router();

import * as stereotype from '../controllers/stereotypes';

router.get('/:stereotype', stereotype.get_all_stereotypes);

export default router;