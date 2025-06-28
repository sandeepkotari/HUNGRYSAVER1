import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { initializeFirebase } from './config/firebase.js';
import { logger } from './utils/logger.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

// Route imports
import donationRoutes from './routes/donationRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import volunteerRoutes from './routes/volunteerRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import statusRoutes from './routes/statusRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

// Load environment variables
dotenv.config();

// Initialize Firebase
initializeFirebase();

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(limiter);
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com'] 
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// API Routes
app.use('/api/donations', donationRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/status', statusRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Hungry Saver Server running on port ${PORT}`);
  logger.info(`📍 Environment: ${process.env.NODE_ENV}`);
  logger.info(`🔥 Firebase initialized successfully`);
});

export default app;