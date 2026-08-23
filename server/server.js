require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const schemeRoutes = require('./routes/schemeRoutes');
const hallRoutes = require('./routes/hallRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/hall-bookings', hallRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/schedules', scheduleRoutes);

// Auto-seed in-memory store and database with initial rich sample data
const { seedInitialData } = require('./seeds/seedData');
seedInitialData();

// Health & Status check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'ARVIX Ward Citizen Portal API',
    ward: 'Ward No. 14, Central Zone',
    timestamp: new Date().toISOString()
  });
});

// Placeholder for route mounting (will be added as we build each module)
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to ARVIX Ward Grievance and Citizen Services API',
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Error Handler]', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[Server] ARVIX Server running on port ${PORT}`);
    console.log(`[Server] Healthcheck: http://localhost:${PORT}/api/health`);
  });
}

module.exports = app;
