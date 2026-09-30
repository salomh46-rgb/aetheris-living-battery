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

export interface ProcessData {
  pid: number;
  name: string;
  cpu: number;
  mem: number;
}

export interface SystemData {
  cpuUsage: number;
  cpuTemp: number;
  memTotal: number;
  memUsed: number;
  memPercent: number;
  topProcesses: ProcessData[];
}

export interface TelemetryPayload {
  battery: BatteryData;
  system: SystemData;
}

declare global {
  interface Window {
    aetherisApi?: {
      onTelemetryUpdate: (callback: (data: TelemetryPayload) => void) => () => void;
      hideWindow: () => void;
      quitApp: () => void;
      setLimitNotification: (enabled: boolean) => void;
      getInitialData: () => Promise<TelemetryPayload | null>;
      openExternal: (url: string) => void;
    };
  }
}
