// Tiny Express static server for Calmyra (serves files from /app)
const path = require('path');
const express = require('express');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const ROOT = path.resolve(__dirname, '..');

app.use(compression());

// Cache static assets aggressively (images/css/js)
app.use((req, res, next) => {
  if (/\.(css|js|png|jpg|jpeg|webp|svg|woff2?|ttf|ico)$/i.test(req.path)) {
    res.setHeader('Cache-Control', 'public, max-age=3600');
  } else {
    res.setHeader('Cache-Control', 'no-cache');
  }
  next();
});

// Serve static files from project root
app.use(express.static(ROOT, {
  extensions: ['html'],
  index: 'index.html',
}));

// SPA-like fallback for missing pages -> 404 served as index? No, we serve a simple 404.
app.use((req, res) => {
  res.status(404).sendFile(path.join(ROOT, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`Calmyra static server running on http://${HOST}:${PORT} (root: ${ROOT})`);
});
