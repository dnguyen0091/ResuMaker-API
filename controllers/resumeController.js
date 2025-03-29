import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const uploadResume = async (req, res) => {
    const { email } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ error: 'No file uploaded.' });

    try {
        const updatedUser = await User.findOneAndUpdate(
            { email },
            { 
                $push: { 
                    resumes: { 
                        fileName: file.filename, 
                        filePath: `/uploads/resumes/${file.filename}`, 
                        uploadedAt: new Date() 
                    } 
                }
            },
            { new: true }
        );

        if (!updatedUser) return res.status(404).json({ error: 'User not found.' });

        res.status(200).json({
            message: 'Resume uploaded successfully.',
            resumes: updatedUser.resumes
        });

    } catch (error) {
        console.error('Error uploading resume:', error);
        res.status(500).json({ error: 'Server error, please try again later.' });
    }
};

export const getUserResumes = async (req, res) => {
    const { email } = req.params;

    try {
        const user = await User.findOne({ email }).populate('resumes').lean();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user.resumes);
    } catch (error) {
        console.error('Error fetching resumes:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Endpoint to view a specific resume by ID
export const viewResume = async (req, res) => {
    const { userId, resumeId } = req.params;

    try {
        // Find the user by ID
        const user = await User.findById(userId).lean();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Log the resumes to check their content
        console.log('User resumes:', user.resumes);

        if (!Array.isArray(user.resumes)) {
            return res.status(400).json({ message: 'Invalid resumes data' });
        }

        // Search for the resume in the user's `resumes` array
        const resume = user.resumes.find(r => r._id && r._id.toString() === resumeId);

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        // Send the file as a response
        res.sendFile(`${process.cwd()}${resume.filePath}`);
    } catch (error) {
        console.error('Error fetching resume:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};