import express from 'express';
import { registerUser, loginUser, checkExists, verifyEmail, forgotPassword } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/verifyEmail', verifyEmail);
router.post('/login', loginUser);
router.post('/forgotPassword', forgotPassword);
router.post('/checkExists', checkExists);

export default router;