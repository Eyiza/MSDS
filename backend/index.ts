import Fastify from 'fastify';
import dotenv from 'dotenv';
import mongoose from "mongoose";

dotenv.config();

const app = Fastify();
const PORT = Number(process.env.PORT) || 5000;
const MONGODB_URL = process.env.MONGODB_URL || "";

// Routes
app.get('/', async (req, res) => {
  res.send("MSDS Backend Running");
});

// Start server and connect to MongoDB
const start = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URL);
    console.log('Connected to MongoDB');

    await app.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`Server running at http://localhost:${PORT}`);
  } catch (err) {
    console.error('MongoDB connection error:', err);
    app.log.error(err);
    process.exit(1);
  }
};

start();
