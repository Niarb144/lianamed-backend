import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

const seed = async () => {
  await connectDB();
  await User.deleteMany({});

  const salt = await bcrypt.genSalt(10);
  const admin = new User({
    name: 'Admin User',
    email: 'admin@lianamed.test',
    password: await bcrypt.hash('AdminPass123!', salt),
    role: 'admin'
  });

  const phar = new User({
    name: 'Pharmacist User',
    email: 'pharma@lianamed.test',
    password: await bcrypt.hash('PharmaPass123!', salt),
    role: 'pharmacist'
  });

  const patient = new User({
    name: 'Patient User',
    email: 'patient@lianamed.test',
    password: await bcrypt.hash('PatientPass123!', salt),
    role: 'patient'
  });

  await admin.save();
  await phar.save();
  await patient.save();
  console.log('Seeded users');
  process.exit();
};

seed();
