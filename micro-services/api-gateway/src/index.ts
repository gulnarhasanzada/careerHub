import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();



const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

const startServer = async ()=>{
    try {
        app.listen(PORT, ()=>{
            console.log(`🚀 User service running on port ${PORT}`);
        })
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
