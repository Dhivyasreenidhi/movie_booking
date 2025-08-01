// microserviceProxy.js
// Node.js Express proxy microservice to connect frontend (4200) and backend (5000)

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
app.use(cors());

// Health check endpoint (should be before proxy middleware)
app.get('/health', (req, res) => {
  res.send('Microservice Proxy is running');
});

// Handle favicon.ico requests to avoid proxy timeout/404
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// Logging middleware for debugging
app.use((req, res, next) => {
  console.log(`[Proxy] ${req.method} ${req.originalUrl}`);
  next();
});



// Proxy /api requests to backend server on port 5000
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:5002',
  changeOrigin: true,
  logLevel: 'debug',
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[Proxy] Forwarding to: http://localhost:5002${req.originalUrl}`);
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).send('Proxy error: ' + err.message);
  }
}));



// Proxy all other requests to frontend server on port 4200
app.use('/', createProxyMiddleware({
  target: 'http://localhost:4200',
  changeOrigin: true,
  ws: true,
  logLevel: 'debug',
  pathRewrite: {
    '^/': '/',
  },
}));

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Microservice Proxy running on port ${PORT}`);
});