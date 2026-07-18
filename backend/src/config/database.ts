import mongoose from 'mongoose';
import { config } from './env';

export async function connectDB(): Promise<void> {
  mongoose.set('strictQuery', true);
  await mongoose.connect(config.mongoUri);
  console.log('✓ MongoDB connected:', mongoose.connection.host);
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
}
