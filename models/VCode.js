import mongoose from 'mongoose';

const VCodeSchema = new mongoose.Schema({
  verificationCode: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  used: {
    type: Boolean,
    required: true,
    default: false
  }
}, {
  timestamps: true,
  collection: 'Users'
});

const VCode = mongoose.model('Vcode', VCodeSchema);

export default VCode;