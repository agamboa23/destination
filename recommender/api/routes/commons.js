import Router from 'express';
const router = Router();

import { get_images_by_locations,get_default_image } from '../controllers/commons';

router.get('/images/:locations', get_images_by_locations);
router.get('/images/', get_default_image);

export default router;