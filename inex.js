import mongoose from 'mongoose';
const MONGODB_URI = process.env.MONGODB_URI; // Get MongoDB URI from environment variable
let cached = global.mongoose || { conn: null, promise: null };
export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;
  if (!MONGODB_URI) throw new Error('MONGODB_URI is missing');

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: 'Pocketshop',
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;

  return cached.conn;
};

global.mongoose = cached;
