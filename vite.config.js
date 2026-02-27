import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// https://vite.dev/config/
const PROJECT_ROOT = path.dirname(fileURLToPath(import.meta.url));
const WEBHOOK_STORE_PATH = path.resolve(PROJECT_ROOT, '.data/webhook-test-data.json');

async function ensureStore() {
  await fs.mkdir(path.dirname(WEBHOOK_STORE_PATH), { recursive: true });

  try {
    await fs.access(WEBHOOK_STORE_PATH);
  } catch {
    await fs.writeFile(WEBHOOK_STORE_PATH, '{}', 'utf8');
  }
}

async function readStore() {
  await ensureStore();
  const raw = await fs.readFile(WEBHOOK_STORE_PATH, 'utf8');

  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed ? parsed : {};
  } catch {
    return {};
  }
}

async function writeStore(store) {
  await ensureStore();
  await fs.writeFile(WEBHOOK_STORE_PATH, JSON.stringify(store, null, 2), 'utf8');
}

async function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });

    req.on('error', reject);
  });
}

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

function extractKey(urlPathname) {
  const pathMatch = /^\/api\/webhook-test-data\/([^/]+)$/.exec(urlPathname);
  return pathMatch ? decodeURIComponent(pathMatch[1]) : '';
}

async function handleWebhookApi(req, res) {
  const url = new URL(req.url, 'http://localhost');

  if (!url.pathname.startsWith('/api/webhook-test-data')) {
    return false;
  }

  if (req.method === 'GET' && url.pathname === '/api/webhook-test-data') {
    const store = await readStore();
    const keys = Object.entries(store).map(([key, entry]) => ({
      key,
      updatedAt: entry.updatedAt,
    }));

    sendJson(res, 200, { keys });
    return true;
  }

  if (req.method === 'GET') {
    const key = extractKey(url.pathname) || url.searchParams.get('key') || '';
    const trimmedKey = key.trim();

    if (!trimmedKey) {
      sendJson(res, 400, { error: 'A key is required' });
      return true;
    }

    const store = await readStore();
    if (!store[trimmedKey]) {
      sendJson(res, 404, { error: `No payload found for key "${trimmedKey}"` });
      return true;
    }

    sendJson(res, 200, {
      key: trimmedKey,
      data: store[trimmedKey].data,
      updatedAt: store[trimmedKey].updatedAt,
    });
    return true;
  }

  if (req.method === 'POST' && url.pathname === '/api/webhook-test-data') {
    const body = await readJsonBody(req);
    const key = typeof body.key === 'string' ? body.key.trim() : '';
    const data = body.data;

    if (!key) {
      sendJson(res, 400, { error: 'Body must include a non-empty "key"' });
      return true;
    }

    if (data === null || typeof data !== 'object' || Array.isArray(data)) {
      sendJson(res, 400, { error: 'Body must include "data" as a JSON object' });
      return true;
    }

    const store = await readStore();
    const updatedAt = new Date().toISOString();
    store[key] = { data, updatedAt };
    await writeStore(store);

    sendJson(res, 200, { key, data, updatedAt });
    return true;
  }

  sendJson(res, 405, { error: 'Method not allowed' });
  return true;
}

function webhookDataApiPlugin() {
  const middleware = async (req, res, next) => {
    try {
      const handled = await handleWebhookApi(req, res);
      if (!handled) {
        next();
      }
    } catch (error) {
      sendJson(res, 500, { error: error.message || 'Unexpected error' });
    }
  };

  return {
    name: 'webhook-data-api',
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}

export default defineConfig({
  plugins: [react(), webhookDataApiPlugin()],
});
