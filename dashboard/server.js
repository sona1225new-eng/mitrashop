require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Import models to ensure schemas are registered
const models = require('./models');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: [
    'https://dps-school.onrender.com',
    'http://localhost:3000',
    'http://localhost:5173',
  ],
  credentials: true,
}));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'DPS School Management ERP Backend is running smoothly',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    modelsLoaded: Object.keys(models),
  });
});

// Root Route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to DPS School Management System (ERP) API',
    documentation: '/api/health',
    connectedWebsite: 'https://dps-school.onrender.com',
  });
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and Start Server
if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`[Server] DPS School ERP running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });
  });
}

module.exports = app;
