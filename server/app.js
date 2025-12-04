// app.js (patched for Render / production robustness)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(cookieParser());

// --- CORS configuration ---
const FRONT_ORIGINS = [
  'https://housecare.tecnavis.in',
  'https://www.housecare.tecnavis.in',
  // local development origins (optional)
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

// create a reusable cors options object so preflight + runtime use same behavior
const corsOptionsDelegate = (req, callback) => {
  const origin = req.header('origin');
  // allow non-browser clients that send no Origin header (curl, Postman)
  if (!origin) {
    return callback(null, { origin: true, credentials: true });
  }
  if (FRONT_ORIGINS.includes(origin)) {
    return callback(null, {
      origin: true,
      credentials: true,
      methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
      allowedHeaders: ['Content-Type','Authorization','X-Requested-With'],
    });
  }
  // origin present but not allowed
  return callback(new Error('CORS policy: origin not allowed'), { origin: false });
};

// use the delegate for normal requests
app.use((req, res, next) => {
  cors(corsOptionsDelegate)(req, res, (err) => {
    if (err) {
      // consistent JSON response for CORS rejection
      return res.status(403).json({ error: 'CORS policy: origin not allowed' });
    }
    next();
  });
});
// use the same options for preflight
app.options('*', cors(corsOptionsDelegate));

// --- DB connect (supports MONGO_URI or MONGODB_URI env names) ---
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/housecare';

const connectWithRetry = async (retries = 0) => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(`MongoDB connection error (attempt ${retries + 1}):`, err.message || err);
    // Do NOT exit the process here; keep the app up and retry a few times
    const maxRetries = 5;
    if (retries < maxRetries) {
      const backoff = Math.min(30000, 2000 * Math.pow(2, retries)); // 2s,4s,8s...
      console.log(`Retrying MongoDB connection in ${backoff}ms...`);
      setTimeout(() => connectWithRetry(retries + 1), backoff);
    } else {
      console.warn('Max MongoDB connection attempts reached. The app will continue to run but DB operations may fail until DB is reachable.');
    }
  }
};
connectWithRetry();

// --- basic routes ---
// root route (helps browser / health probes that hit '/')
app.get('/', (req, res) => {
  res.json({
    ok: true,
    service: 'housecare-api',
    env: process.env.NODE_ENV || 'dev',
    version: process.env.npm_package_version || null,
  });
});

// health route
app.get('/health', (req, res) => res.json({ ok: true, env: process.env.NODE_ENV || 'dev' }));

// mount your auth route (safely)
try {
  const authRoutes = require('./routes/auth');
  app.use('/api/auth', authRoutes);
} catch (err) {
  console.error('Could not mount ./routes/auth:', err && err.message ? err.message : err);
  // continue running — missing/buggy auth route shouldn't crash the whole server during deploy
}

// --- serve frontend build (if single repo) ---
// look for build in common locations: client/build, frontend/build, build
if (process.env.NODE_ENV === 'production') {
  const possibleBuildPaths = [
    path.join(__dirname, 'client', 'build'),
    path.join(__dirname, 'frontend', 'build'),
    path.join(__dirname, 'build'),
  ];
  let clientBuildPath = null;
  for (const p of possibleBuildPaths) {
    if (fs.existsSync(p)) {
      clientBuildPath = p;
      break;
    }
  }
  if (clientBuildPath) {
    app.use(express.static(clientBuildPath));
    // keep API routes above; send index.html for others (SPA)
    app.get('*', (req, res) => {
      res.sendFile(path.join(clientBuildPath, 'index.html'));
    });
    console.log('Serving static frontend from:', clientBuildPath);
  } else {
    console.warn('Production build not found in client/build, frontend/build, or build — static files will not be served.');
  }
}

// --- error handler (simple) ---
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && err.stack ? err.stack : err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// --- start server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'dev'} on port ${PORT}`);
});

// export app for testing or external use
module.exports = app;

// --- process-level handlers to aid debugging in production ---
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err && err.stack ? err.stack : err);
  // do not exit — for production you might want to restart or alert
});
process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason);
});
