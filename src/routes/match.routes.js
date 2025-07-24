import { Router } from 'express';
import MatchController from '../controllers/match.controller.js';

const router = Router();

router.post('/', MatchController.playMatch);
router.get('/by-season', MatchController.getBySeason);

export default router; 