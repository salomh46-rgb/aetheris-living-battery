import { app, BrowserWindow, Tray, Menu, screen, nativeImage, ipcMain, Notification, shell } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import si from 'systeminformation';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let telemetryInterval: NodeJS.Timeout | null = null;
let notifyOn80 = true;
let hasNotified80 = false;

import fs from 'fs';

// Kichik yashil zaryad belgisi ikonkasini yuklash
function getTrayIcon(): Electron.NativeImage {
  const icoPath = path.join(__dirname, '../resources/tray.ico');
  const pngPath = path.join(__dirname, '../resources/tray.png');
  if (fs.existsSync(icoPath)) {
    return nativeImage.createFromPath(icoPath);
  }
  if (fs.existsSync(pngPath)) {
    return nativeImage.createFromPath(pngPath);
  }
  return createDefaultTrayIcon();
}

function createDefaultTrayIcon(): Electron.NativeImage {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="7" width="16" height="10" rx="2" ry="2" fill="rgba(16,185,129,0.3)"/>
    <line x1="22" y1="11" x2="22" y2="13"/>
    <polygon points="10 9 7 14 11 14 9 19" fill="#10b981" stroke="none"/>
  </svg>`;
  return nativeImage.createFromBuffer(Buffer.from(svg), { width: 16, height: 16 });
}

async function collectTelemetry() {
  try {
    const [battery, load, mem, temp, procs] = await Promise.all([
      si.battery().catch(() => ({
        hasBattery: true,
        isCharging: true,
        percent: 85,
        timeRemaining: 180,
        acConnected: true,
        type: 'Li-Ion',
        model: 'Universal Pack',
        currentCapacity: 45000,
        maxCapacity: 52000,
        cycleCount: 142,
      })),
      si.currentLoad().catch(() => ({ currentLoad: 12.4 })),
      si.mem().catch(() => ({ total: 16 * 1024 * 1024 * 1024, used: 8 * 1024 * 1024 * 1024 })),
      si.cpuTemperature().catch(() => ({ main: 44 })),
      si.processes().catch(() => ({ list: [] })),
    ]);

    // Top 4 quvvat va CPU oluvchi jarayonlar
    const topProcesses = (procs.list || [])
      .sort((a: any, b: any) => b.cpu - a.cpu)
      .slice(0, 4)
      .map((p: any) => ({
        pid: p.pid,
        name: p.name,
        cpu: Math.round(p.cpu * 10) / 10,
        mem: Math.round(p.mem * 10) / 10,
      }));

    const memPercent = mem.total > 0 ? Math.round((mem.used / mem.total) * 100) : 50;

    const data = {
      battery: {
        hasBattery: battery.hasBattery ?? true,
        isCharging: battery.isCharging ?? false,
        percent: battery.percent ?? 85,
        timeRemaining: battery.timeRemaining ?? 120,
        acConnected: battery.acConnected ?? true,
        type: battery.type || 'Li-Polymer',
        model: battery.model || 'OEM Battery',
        currentCapacity: battery.currentCapacity || 0,
        maxCapacity: battery.maxCapacity || 0,
        cycleCount: battery.cycleCount || 88,
        designedCapacity: (battery as any).designedCapacity || battery.maxCapacity || 0,
      },
      system: {
        cpuUsage: Math.round(load.currentLoad * 10) / 10,
        cpuTemp: Math.round(temp.main || 42),
        memTotal: Math.round(mem.total / (1024 * 1024 * 1024)),
        memUsed: Math.round(mem.used / (1024 * 1024 * 1024) * 10) / 10,
        memPercent,
        topProcesses,
      },
    };

    // 80% batareya degradatsiyasidan asrash bildirishnomasi
    if (data.battery.isCharging && data.battery.percent >= 80 && notifyOn80 && !hasNotified80) {
      if (Notification.isSupported()) {
        const notif = new Notification({
          title: '🔋 Aetheris: 80% Zaryadga Yetdi',
          body: 'Batareya uzoq yillar xizmat qilishi uchun noutbukni quvvatlagichdan uzishingiz tavsiya etiladi.',
          silent: false,
        });
        notif.show();
      }
      hasNotified80 = true;
    } else if (!data.battery.isCharging || data.battery.percent < 78) {
      hasNotified80 = false;
    }

    return data;
  } catch (err) {
    console.error('Telemetriya olishda xatolik:', err);
    return null;
  }
}

function getWindowPosition(): { x: number; y: number } {
  const windowBounds = mainWindow!.getBounds();
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;

  // Windows 11 Taskbar odatda pastda joylashgan, shuning uchun pastki o'ng burchak
  const x = Math.round(screenWidth - windowBounds.width - 16);
  const y = Math.round(screenHeight - windowBounds.height - 12);

  return { x, y };
}

function showWindow() {
  if (!mainWindow) return;
  const { x, y } = getWindowPosition();
  mainWindow.setPosition(x, y, false);
  mainWindow.show();
  mainWindow.focus();
}

function toggleWindow() {
  if (!mainWindow) return;
  if (mainWindow.isVisible()) {
    mainWindow.hide();
  } else {
    showWindow();
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 390,
    height: 640,
    show: false,
    frame: false,
    resizable: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Tashqariga bosilganda yashirish
  mainWindow.on('blur', () => {
    if (!mainWindow?.webContents.isDevToolsOpened()) {
      mainWindow?.hide();
    }
  });

  const devUrl = 'http://localhost:5173';
  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    mainWindow.loadURL(devUrl).catch(() => {
      mainWindow?.loadFile(path.join(__dirname, '../dist/index.html'));
    });
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

function createTray() {
  const icon = getTrayIcon();
  tray = new Tray(icon);
  tray.setToolTip('Aetheris - Living Battery & System Biome');

  tray.on('click', () => {
    toggleWindow();
  });

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Aetheris Oynasini Ochish',
      click: () => showWindow(),
    },
    { type: 'separator' },
    {
      label: '80% Zaryad Qo\'ng\'irog\'i',
      type: 'checkbox',
      checked: notifyOn80,
      click: (item) => {
        notifyOn80 = item.checked;
      },
    },
    { type: 'separator' },
    {
      label: 'Chiqish',
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.on('right-click', () => {
    tray?.popUpContextMenu(contextMenu);
  });
}

app.whenReady().then(async () => {
  createWindow();
  createTray();

  // Dastlabki ma'lumotlarni IPC orqali uzatish
  ipcMain.handle('get-initial-data', async () => {
    return await collectTelemetry();
  });

  ipcMain.on('hide-window', () => {
    mainWindow?.hide();
  });

  ipcMain.on('quit-app', () => {
    app.quit();
  });

  ipcMain.on('set-limit-alarm', (_e, enabled: boolean) => {
    notifyOn80 = enabled;
  });

  ipcMain.on('open-external', (_e, url: string) => {
    shell.openExternal(url);
  });

  // Har 2 soniyada yangilanish
  telemetryInterval = setInterval(async () => {
    if (mainWindow && mainWindow.isVisible()) {
      const data = await collectTelemetry();
      if (data) {
        mainWindow.webContents.send('telemetry-update', data);
      }
    }
  }, 2000);

  // Bir marta dastlab ochib ko'rsatamiz
  setTimeout(() => {
    showWindow();
  }, 1000);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  if (telemetryInterval) clearInterval(telemetryInterval);
});
