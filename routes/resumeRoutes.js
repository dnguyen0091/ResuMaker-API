import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadResume, getUserResumes } from '../controllers/resumeController.js';

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

// Resume Upload Route
router.post('/upload-resume', upload.single('resume'), uploadResume);

// Get resumes
router.get('/:email/resumes', getUserResumes);

export default router;