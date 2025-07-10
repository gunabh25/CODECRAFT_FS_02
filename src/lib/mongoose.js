// File: src/lib/mongoose.js
import mongoose from 'mongoose';

export const connectToDatabase = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('⚠️ MONGODB_URI not defined in .env.local');

  if (mongoose.connections[0].readyState) return;

  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};
