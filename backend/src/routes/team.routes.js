import { Router } from 'express';
import TeamController from '../controllers/team.controller.js';

const router = Router();

router.get('/', TeamController.getAllWithSeasons);
router.get('/by-season', TeamController.getBySeason);
router.post('/', TeamController.add);
router.put('/', TeamController.update);
router.delete('/from-season', TeamController.deleteFromSeason);
router.delete('/', TeamController.delete);

export default router; 