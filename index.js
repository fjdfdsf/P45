import express from 'express';
import { Corrosion } from 'corrosion';
import path from 'node:path';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Setup Corrosion proxy
const corrosion = new Corrosion({
  prefix: '/proxy/',
  codec: 'xor', // other options: base64, plain
  requestMiddleware: [],
  responseMiddleware: [],
});

// Static file serving
app.use(express.static(path.join(__dirname, 'static'), {
  maxAge: '1d',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }
  }
}));

// Basic HTML route setup
const routes = [
  { path: '/', file: 'web.html' },
  { path: '/go', file: 'go.html' },
  { path: '/404', file: '404.html' },
];

routes.forEach((route) => {
  app.get(route.path, (req, res) => {
    res.sendFile(path.join(__dirname, 'static', route.file));
  });
});

// Proxy route
app.use('/proxy/', (req, res) => {
  corrosion.request(req, res);
});

// Catch-all fallback
app.get('*', (req, res) => {
  res.redirect('/404');
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
