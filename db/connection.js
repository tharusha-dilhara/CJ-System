const mongoose = require("mongoose");

const connectDB = async () => {
  
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 30
    });
    console.log('Database connected');
  } catch (error) {
    console.error('Database connection error:', error);
  }
};

module.exports = connectDB;


