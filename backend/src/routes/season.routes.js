import { Router } from 'express';
import SeasonController from '../controllers/season.controller.js';

const router = Router();

router.get('/', SeasonController.getAll);
router.post('/', SeasonController.create);
router.put('/', SeasonController.update);
router.delete('/', SeasonController.delete);

export default router; 