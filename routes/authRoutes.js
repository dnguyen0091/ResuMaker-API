import express from 'express';
import { registerUser, loginUser, checkExists, verifyEmail, forgotPassword, verifyForgot, updatePassword } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/verifyEmail', verifyEmail);
router.post('/login', loginUser);
router.post('/forgotPassword', forgotPassword);
router.post('/checkExists', checkExists);
router.post('/verifyForgot', verifyForgot);
router.post('/updatePassword', updatePassword);

export default router;