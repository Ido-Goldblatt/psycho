import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const uri = process.env.MONGODB_URI;

let isConnected = false;

export async function connectDB() {
  if (isConnected) {
    console.log('Using existing database connection');
    return;
  }

  try {
    console.log('Creating new database connection');
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions;

    await mongoose.connect(uri, options);
    
    isConnected = true;
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
  }
}

export default connectDB; 