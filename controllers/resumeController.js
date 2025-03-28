import User from '../models/User.js';
import Resume from '../models/Resume.js';

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

// Endpoint to get a specific resume by ID
export const getResumeById = async (req, res) => {
    const { resumeId } = req.params;

    try {
        // Find the user who has this resume in their resumes array
        const user = await User.findOne({ "resumes._id": resumeId });

        if (!user) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        // Find the specific resume in the user's resumes array
        const resume = user.resumes.find(r => r._id.toString() === resumeId);

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        res.status(200).json(resume);
    } catch (error) {
        console.error('Error fetching resume:', error);
        res.status(500).send('Internal Server Error');
    }
};
