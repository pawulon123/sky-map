// server.ts
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Readable } from 'node:stream'; // <-- DODAJ

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/** PROXY HYG CSV */
app.get('/api/hyg.csv', async (req, res, next) => {
  try {
    const upstream = 'https://raw.githubusercontent.com/astronexus/HYG-Database/master/hygdata_v3.csv';
    const r = await fetch(upstream, { headers: { Accept: 'text/plain' } });

    if (!r.ok || !r.body) {
      const txt = await r.text().catch(() => '');
      res
        .status(r.status)
        .type('text/plain; charset=utf-8')
        .send(txt || `Upstream error: ${r.status}`);
      return;
    }

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');

    // Node 18+: przekonwertuj Web ReadableStream -> Node Readable i pipuj do Express res
    Readable.fromWeb(r.body as any).pipe(res);
  } catch (e) {
    next(e);
  }
});

/** Statyki z /browser */
app.use(express.static(browserDistFolder, { maxAge: '1y', index: false, redirect: false }));

/** SSR */
app.use('/**', (req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => console.log(`Node Express server listening on http://localhost:${port}`));
}

export const reqHandler = createNodeRequestHandler(app);
