import Router from 'express';
const router = Router();

import { get_images_by_locations } from '../controllers/commons';

router.get('/images/:locations', get_images_by_locations);

export default router;