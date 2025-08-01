import { Router } from 'express';
import MatchController from '../controllers/match.controller.js';

const router = Router();

router.post('/', MatchController.playMatch);
router.get('/by-season', MatchController.getBySeason);
router.post('/generate-schedule', MatchController.generateSchedule);
router.get('/tournament-table', MatchController.getTournamentTable);
router.delete('/:matchId', MatchController.deleteMatch);

export default router; 