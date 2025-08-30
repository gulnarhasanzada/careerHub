import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: [
    process.env.MF_URLS_SHELL || 'http://localhost:3000',
    process.env.MF_URLS_AUTH || 'http://localhost:3001',
  ],
  credentials: true
}));

app.use(express.json());

// Logging
app.use(morgan('combined'));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    gateway: {
      uptime: process.uptime(),
      memory: process.memoryUsage()
    }
  });
});

// Main routes
app.use('/', authRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

const startServer = async ()=>{
    try {
        app.listen(PORT, ()=>{
            console.log(`🚀 API Gateway running on port ${PORT}`);
        })
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer();