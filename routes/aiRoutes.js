import express from 'express';
import multer from 'multer';
import { analyzeResume } from '../controllers/analyzeController.js';
import path from 'path';

// Multer storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');  // Store files in 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);  // Keep the original file name
  }
});

const upload = multer({ storage: storage });  // Apply disk storage configuration

const router = express.Router();

// POST route for resume analysis
router.post('/analyze', upload.single('file'), analyzeResume);  // Handle single file upload

export default router;