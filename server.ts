/**
 * Local development server (bypasses Vercel)
 * Run with: npx ts-node server.ts
 */

// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Import handlers with error handling
let healthHandler, sendHandler, otpHandler, verificationHandler, welcomeHandler, providerCredentialsHandler;

try {
  healthHandler = require('./api/health').default;
  sendHandler = require('./api/send').default;
  otpHandler = require('./api/otp').default;
  verificationHandler = require('./api/verification').default;
  welcomeHandler = require('./api/welcome').default;
  providerCredentialsHandler = require('./api/provider-credentials').default;
  console.log('✅ All handlers loaded successfully');
} catch (error) {
  console.error('❌ Error loading handlers:', error);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Helper to wrap handlers for Express
const wrapHandler = (handler: any) => {
  return async (req: any, res: any) => {
    try {
      await handler(req, res);
    } catch (error: any) {
      console.error('[Server] Handler error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: error.message });
      }
    }
  };
};

// Routes
app.get('/api/health', wrapHandler(healthHandler));
app.get('/', wrapHandler(healthHandler));
app.post('/api/send', wrapHandler(sendHandler));
app.post('/api/otp', wrapHandler(otpHandler));
app.post('/api/verification', wrapHandler(verificationHandler));
app.post('/api/welcome', wrapHandler(welcomeHandler));
app.post('/api/provider-credentials', wrapHandler(providerCredentialsHandler));

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Email service running on http://localhost:${PORT}`);
  console.log(`📧 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Keep process alive
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Don't exit on uncaught exceptions - keep server running
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit on unhandled rejections - keep server running
});

// Keep the process alive - prevent ts-node from exiting
setInterval(() => {
  // Keep-alive heartbeat (runs every 30 seconds)
}, 30000);
