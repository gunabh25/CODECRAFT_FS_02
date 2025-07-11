// Run with: node scripts/seedUser.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

import User from '../src/models/User.js'; // ✅ Update path if needed

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  const hashedPassword = await bcrypt.hash('admin123', 10);

  await User.deleteMany({ email: 'admin@company.com' }); // optional cleanup
  await User.create({
    name: 'Admin',
    email: 'admin@company.com',
    password: hashedPassword,
    role: 'admin'
  });

  console.log('✅ Admin user seeded');
  process.exit();
};

seed();
