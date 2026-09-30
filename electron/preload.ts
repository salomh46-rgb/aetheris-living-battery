import { contextBridge, ipcRenderer } from 'electron';

export interface BatteryData {
  hasBattery: boolean;
  isCharging: boolean;
  percent: number;
  timeRemaining: number;
  acConnected: boolean;
  type: string;
  model: string;
  currentCapacity: number;
  maxCapacity: number;
  cycleCount: number;
  designedCapacity?: number;
}

export interface SystemData {
  cpuUsage: number;
  cpuTemp: number;
  memTotal: number;
  memUsed: number;
  memPercent: number;
  topProcesses: Array<{
    pid: number;
    name: string;
    cpu: number;
    mem: number;
  }>;
}

contextBridge.exposeInMainWorld('aetherisApi', {
  onTelemetryUpdate: (callback: (data: { battery: BatteryData; system: SystemData }) => void) => {
    const handler = (_event: any, data: any) => callback(data);
    ipcRenderer.on('telemetry-update', handler);
    return () => ipcRenderer.removeListener('telemetry-update', handler);
  },
  hideWindow: () => ipcRenderer.send('hide-window'),
  quitApp: () => ipcRenderer.send('quit-app'),
  setLimitNotification: (enabled: boolean) => ipcRenderer.send('set-limit-alarm', enabled),
  getInitialData: () => ipcRenderer.invoke('get-initial-data'),
  openExternal: (url: string) => ipcRenderer.send('open-external', url),
});
