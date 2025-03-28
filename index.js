import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';

dotenv.config();

const app = express();

const startServer = async () => {
  try {
    await connectDB();
    console.log("MongoDB Connected Successfully");

    app.use(express.json());
    app.use(cors({
      origin: [
        'http://localhost:5173',
        'https://resu-maker-web.vercel.app',
        'https://www.resumaker.org'
      ],
      credentials: true
    }));
    app.use(cookieParser());

    app.use('/api/auth', authRoutes);

    app.use('/api/ai', aiRoutes);

    app.use('/api/resume', resumeRoutes);

    app.get('/', (req, res) => {
      res.send('Testing API is running...');
    });

    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({
        message: 'Something went wrong!',
        error: err.message
      });
    });


    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
}

startServer();