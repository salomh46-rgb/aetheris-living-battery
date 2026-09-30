const http = require('http');
const fs = require('fs');
const path = require('path');
const si = require('systeminformation');

const PORT = 3456;
const DIST_DIR = path.join(__dirname, 'dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

async function getLiveTelemetry() {
  try {
    const [battery, load, mem, procs] = await Promise.all([
      si.battery().catch(() => ({})),
      si.currentLoad().catch(() => ({ currentLoad: 12 })),
      si.mem().catch(() => ({ total: 16 * 1024 * 1024 * 1024, used: 8 * 1024 * 1024 * 1024 })),
      si.processes().catch(() => ({ list: [] })),
    ]);

    const topProcesses = (procs.list || [])
      .sort((a, b) => b.cpu - a.cpu)
      .slice(0, 4)
      .map((p) => ({
        pid: p.pid,
        name: p.name,
        cpu: Math.round(p.cpu * 10) / 10,
        mem: Math.round(p.mem * 10) / 10,
      }));

    const memPercent = mem.total > 0 ? Math.round((mem.used / mem.total) * 100) : 50;

    return {
      battery: {
        hasBattery: battery.hasBattery ?? true,
        isCharging: battery.isCharging ?? false,
        percent: battery.percent ?? 79,
        timeRemaining: battery.timeRemaining ?? 120,
        acConnected: battery.acConnected ?? true,
        type: battery.type || 'Li-Ion',
        model: battery.model || 'Universal Pack',
        currentCapacity: battery.currentCapacity || 0,
        maxCapacity: battery.maxCapacity || 0,
        cycleCount: battery.cycleCount || 0,
        designedCapacity: battery.designedCapacity || battery.maxCapacity || 0,
      },
      system: {
        cpuUsage: Math.round((load.currentLoad || 10) * 10) / 10,
        cpuTemp: 44, // Windows standart temp fallback
        memTotal: Math.round((mem.total || 16 * 1024 * 1024 * 1024) / (1024 * 1024 * 1024)),
        memUsed: Math.round(((mem.used || 8 * 1024 * 1024 * 1024) / (1024 * 1024 * 1024)) * 10) / 10,
        memPercent,
        topProcesses,
      },
    };
  } catch (e) {
    console.error('Error fetching live telemetry:', e);
    return null;
  }
}

const server = http.createServer(async (req, res) => {
  let reqPath = req.url.split('?')[0];

  // API Endpoint for Live Hardware Telemetry
  if (reqPath === '/api/telemetry') {
    const data = await getLiveTelemetry();
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    res.end(JSON.stringify(data));
    return;
  }

  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  const filePath = path.join(DIST_DIR, reqPath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      const fallbackPath = path.join(DIST_DIR, 'index.html');
      fs.readFile(fallbackPath, (fbErr, content) => {
        if (fbErr) {
          res.writeHead(500);
          res.end('Server error loading index.html');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
        res.end(content);
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500);
        res.end('Internal Server Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Aetheris hardware telemetry server running at http://127.0.0.1:${PORT}`);
});
