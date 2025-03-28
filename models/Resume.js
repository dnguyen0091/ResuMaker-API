import mongoose from 'mongoose';

const ResumeSchema = new mongoose.Schema({
    fileName: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    }
  }, {
    timestamps: true
  });

const Resume = mongoose.model('Resume', ResumeSchema);

export default Resume;