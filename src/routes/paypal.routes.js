import { Router } from 'express';
import PaypalController from '../controllers/paypal.controller.js';

const router = Router();

router.post('/pay', PaypalController.createPayment);
router.get('/success', PaypalController.success);
router.get('/cancel', PaypalController.cancel);
router.get('/html', PaypalController.html);

export default router; 