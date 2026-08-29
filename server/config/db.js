const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/arvix';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500, // Quick timeout if local mongo is not running
    });
    isConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    try {
      const { seedInitialData } = require('../seeds/seedData');
      await seedInitialData();
    } catch (err) {
      console.warn('[Seed]', err.message);
    }
  } catch (error) {
    isConnected = false;
    console.warn(`[Database] MongoDB connection note: ${error.message}`);
    console.log('[Database] Operating with resilient in-memory/fallback mode for demo & standalone testing.');
  }
};

const getIsConnected = () => isConnected;

module.exports = { connectDB, getIsConnected };
