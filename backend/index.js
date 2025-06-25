import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

console.log('MONGODB_URI:', process.env.MONGODB_URI);

// Water Intake Schema
const waterIntakeSchema = new mongoose.Schema({
  capacity: { type: Number, required: true }, // in ml
  timestamp: { type: Date, default: Date.now }
});
const WaterIntake = mongoose.model('WaterIntake', waterIntakeSchema);

// Add a new water intake entry
app.post('/api/water', async (req, res) => {
  const { capacity, timestamp } = req.body;
  if (!capacity) return res.status(400).json({ error: 'Capacity is required' });
  const entry = new WaterIntake({
    capacity,
    timestamp: timestamp ? new Date(timestamp) : undefined
  });
  await entry.save();
  res.status(201).json(entry);
});

// Get all water intake entries
app.get('/api/water', async (req, res) => {
  const entries = await WaterIntake.find().sort({ timestamp: -1 });
  res.json(entries);
});

// Health check
app.get('/', (req, res) => {
  res.send('Water Tracker Backend is running!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
