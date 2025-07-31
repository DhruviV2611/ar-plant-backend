const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('express-jwt'); // If you're using this or similar
const jwksRsa = require('jwks-rsa');
dotenv.config();
const app = express();

// ✅ CORS Configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// ✅ Middleware for JSON body parsing with error catch
app.use(express.json({
  limit: '10mb',
  verify: (req, res, buf) => {
    try {
      JSON.parse(buf);
    } catch (e) {
      throw new Error('Invalid JSON');
    }
  }
}));

app.use(express.urlencoded({
  extended: true,
  limit: '10mb'
}));

// ✅ Catch JSON Syntax Errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('JSON parsing error:', err.message);
    return res.status(400).json({
      message: 'Invalid JSON format in request body',
      error: 'Please check your request data format'
    });
  }
  next(err);
});

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('---->>>> MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // Exit if DB connection fails
  });

app.use((req, res, next) => {
    if (req.auth && req.auth.userId) { // Assuming your JWT decodes to req.auth and has userId
        req.user = { id: req.auth.userId };
    }
    next();
});

const plantRoutes = require('./src/routes/plantRoutes');
const authRoutes = require('./src/routes/authRoutes');

app.use('/api/plants', plantRoutes);
app.use('/api/auth', authRoutes);

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
