import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/careerhub';

export const connectDB = async (): Promise<void> => {
    try{
        mongoose.connect(MONGODB_URI)
    }catch(error){
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
}

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('📁 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ MongoDB disconnection error:', error);
  }
};