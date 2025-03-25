const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

dotenv.config();
// connectDB();

const app = express();

connectDB().then(() => {
  console.log("MongoDB Connected Successfully");
}).catch((error) => {
  console.error("MongoDB Connection Error:", error);
  process.exit(1);
});

app.use(express.json());
app.use(cors({
  origin: [
  'http://localhost:5173',
  'https://resu-maker-web.vercel.app'],
  credentials: true
}));
app.use(cookieParser());

app.use('/api/auth', require('./routes/authRoutes'));

app.get('/', (req, res) => {
  res.send('Testing API is running...');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message })
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));