import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'studio-db.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readDb(): Record<string, unknown> | null {
  try {
    ensureDataDir();
    if (!fs.existsSync(DB_FILE)) {
      return null;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading studio-db.json:', err);
    return null;
  }
}

function writeDb(data: Record<string, unknown>) {
  try {
    ensureDataDir();
    const existing = readDb() || {};
    const merged = {
      ...existing,
      ...data,
      updatedAt: Date.now(),
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(merged, null, 2), 'utf-8');
    return merged;
  } catch (err) {
    console.error('Error writing studio-db.json:', err);
    return null;
  }
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '50mb' }));

  // Healthcheck endpoint for Cloud Run / load balancers
  app.get('/api/health', (_req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime() });
  });

  // API: Get persistent studio state
  app.get('/api/studio-state', (_req, res) => {
    const data = readDb();
    if (!data) {
      res.json({ initialized: false });
      return;
    }
    res.json({ initialized: true, ...data });
  });

  // API: Save persistent studio state
  app.post('/api/studio-state', (req, res) => {
    const saved = writeDb(req.body || {});
    res.json({ ok: true, updatedAt: saved?.updatedAt || Date.now() });
  });

  const isProduction =
    process.env.NODE_ENV === 'production' ||
    (process.env.NODE_ENV !== 'development' && fs.existsSync(path.join(__dirname, 'dist', 'index.html')));

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Hossam Keno Studio Server running on http://0.0.0.0:${PORT}`);
  });

  process.on('SIGTERM', () => {
    console.log('SIGTERM received, closing server');
    server.close(() => {
      process.exit(0);
    });
  });
}

startServer();
