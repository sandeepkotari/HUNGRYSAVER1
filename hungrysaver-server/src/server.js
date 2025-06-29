import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Load environment variables FIRST - this is critical!
dotenv.config();

// Debug: Log email environment variables to verify they're loaded
console.log('🔍 Environment Variables Check:');
console.log('EMAIL_HOST:', process.env.EMAIL_HOST || 'NOT SET');
console.log('EMAIL_PORT:', process.env.EMAIL_PORT || 'NOT SET');
console.log('EMAIL_USER:', process.env.EMAIL_USER || 'NOT SET');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***HIDDEN***' : 'NOT SET');
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');

// Initialize Firebase AFTER environment variables are loaded
import { initializeFirebase } from './config/firebase.js';
initializeFirebase();

// Now import services and other modules that depend on Firebase
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
import authRoutes from './routes/authRoutes.js';

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

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Hungry Saver Server is working! 🚀',
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    emailService: {
      configured: !!(process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS),
      host: process.env.EMAIL_HOST || 'Not configured'
    },
    features: {
      userRegistrationEmails: 'Enabled',
      donationNotifications: 'Enabled',
      volunteerAlerts: 'Enabled',
      statusTracking: 'Enabled'
    },
    endpoints: {
      donations: '/api/donations',
      requests: '/api/requests',
      volunteers: '/api/volunteers',
      notifications: '/api/notifications',
      auth: '/api/auth',
      dashboard: '/api/dashboard'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    services: {
      firebase: 'Connected',
      email: !!(process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) ? 'Configured' : 'Disabled'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
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
  
  // Log email service status
  const emailConfigured = !!(process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS);
  if (emailConfigured) {
    logger.info(`📧 Email service configured with host: ${process.env.EMAIL_HOST}`);
    logger.info(`✅ Registration confirmation emails: ENABLED`);
    logger.info(`✅ Donation notification emails: ENABLED`);
  } else {
    logger.warn(`📧 Email service disabled - missing credentials`);
  }
});

export default app;