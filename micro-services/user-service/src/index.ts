import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import authRoutes from './routes/authRoutes';
import { connectDB } from './config/db';
import { errorHandler } from './middleware/errorHandler';
import cookieParser from 'cookie-parser';



const app = express();
const PORT = process.env.PORT || 4001;

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use(errorHandler)

const startServer = async ()=>{
    try {
        await connectDB();
        app.listen(PORT, ()=>{
            console.log(`🚀 User service running on port ${PORT}`);
        })
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer();


