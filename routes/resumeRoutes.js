import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadResume, getUserResumes, getResumeById } from '../controllers/resumeController.js';
import { generateKeySync } from 'crypto';

const router = express.Router();

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/resumes');
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        cb(null, `${timestamp}_${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// Resume upload route
router.post('/upload-resume', upload.single('resume'), uploadResume);

// Get all resumes
router.get('/:email/resumes', getUserResumes);

// Get resume by ID
router.get('/view/:resumeId', getResumeById);

export default router;