import express from 'express';
import multer from 'multer';
import { uploadResume, getUserResumes, viewResume } from '../controllers/resumeController.js';

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
router.get('/view/:userId/:resumeId', viewResume);

export default router;