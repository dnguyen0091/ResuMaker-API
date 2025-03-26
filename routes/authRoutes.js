import express from 'express';
import { registerUser, loginUser, checkExists } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/checkExists', checkExists);

export default router;