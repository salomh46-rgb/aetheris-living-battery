import React, { useState, useEffect } from 'react';
import { FloatingIsland3D } from './components/FloatingIsland3D';
import { BatteryCard } from './components/BatteryCard';
import { SystemTelemetry } from './components/SystemTelemetry';
import { PowerLeakHunter } from './components/PowerLeakHunter';
import { Header } from './components/Header';
import { TelemetryPayload } from './types';
import { Activity, Flame, Shield } from 'lucide-react';

const mockTelemetry: TelemetryPayload = {
  battery: {
    hasBattery: true,
    isCharging: true,
    percent: 86,
    timeRemaining: 145,
    acConnected: true,
    type: 'Li-Polymer',
    model: 'Smart Battery Pack',
    currentCapacity: 48000,
    maxCapacity: 54000,
    cycleCount: 114,
    designedCapacity: 56000,
  },
  system: {
    cpuUsage: 14.8,
    cpuTemp: 44,
    memTotal: 16,
    memUsed: 7.9,
    memPercent: 49,
    topProcesses: [
      { pid: 1420, name: 'Antigravity IDE', cpu: 7.2, mem: 4.1 },
      { pid: 8840, name: 'Google Chrome', cpu: 4.5, mem: 3.2 },
      { pid: 512, name: 'Windows System', cpu: 1.8, mem: 0.8 },
      { pid: 10424, name: 'Spotify Audio', cpu: 1.1, mem: 0.6 },
    ],
  },
};

export const App: React.FC = () => {
  const [telemetry, setTelemetry] = useState<TelemetryPayload>(mockTelemetry);
  const [activeTab, setActiveTab] = useState<'system' | 'leaks'>('system');
  const [notifyOn80, setNotifyOn80] = useState(true);
  const [isMini, setIsMini] = useState(false);

  useEffect(() => {
    // 1. Electron IPC orqali olish (agar Electron bo'lsa)
    if (window.aetherisApi) {
      window.aetherisApi.getInitialData().then((data) => {
        if (data) setTelemetry(data);
      });

      const unsubscribe = window.aetherisApi.onTelemetryUpdate((data) => {
        setTelemetry(data);
      });

      return () => {
        unsubscribe();
      };
    }

    // 2. Real Windows Hardware API (/api/telemetry) orqali olish
    const fetchRealData = async () => {
      try {
        const res = await fetch('/api/telemetry');
        if (res.ok) {
          const data = await res.json();
          if (data && data.battery) {
            setTelemetry(data);
          }
        }
      } catch (e) {
        // ignore network glitches
      }
    };

    fetchRealData();
    const timer = setInterval(fetchRealData, 2000);

    return () => clearInterval(timer);
  }, []);

  const handleToggleLimit = (enabled: boolean) => {
    setNotifyOn80(enabled);
    if (window.aetherisApi) {
      window.aetherisApi.setLimitNotification(enabled);
    }
  };

  const handleHide = () => {
    if (window.aetherisApi) {
      window.aetherisApi.hideWindow();
    }
  };

  const handleQuit = () => {
    if (window.aetherisApi) {
      window.aetherisApi.quitApp();
    }
  };

  return (
    <div className="w-screen h-screen bg-[#080a0f] flex items-center justify-center p-2 overflow-hidden">
      <div
        className={`acrylic-card rounded-[28px] p-4 flex flex-col justify-between overflow-hidden shadow-2xl relative select-none transition-all duration-300 ${
          isMini ? 'w-[320px] h-[340px]' : 'w-[390px] h-[640px]'
        }`}
      >
      {/* Yuqori Header */}
      <Header
        onHide={handleHide}
        onQuit={handleQuit}
        isMini={isMini}
        onToggleMini={() => setIsMini(!isMini)}
      />

      {/* 3D Living Floating Island Biosferasi */}
      <div className={isMini ? 'my-0' : 'my-1'}>
        <FloatingIsland3D
          batteryPercent={telemetry.battery.percent}
          isCharging={telemetry.battery.isCharging}
          cpuLoad={telemetry.system.cpuUsage}
          cpuTemp={telemetry.system.cpuTemp}
        />
      </div>

      {isMini ? (
        /* Mini Desktop Vidjet Ko'rinishi */
        <div className="acrylic-subcard rounded-xl px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xl font-bold text-white">
              {telemetry.battery.percent}%
            </span>
            <span className="text-[11px] text-white/60">
              {telemetry.battery.isCharging ? 'Zaryadlanmoqda' : 'Batareyada'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
            <span>CPU: {telemetry.system.cpuUsage}%</span>
            <span>•</span>
            <span>{telemetry.system.cpuTemp}°C</span>
          </div>
        </div>
      ) : (
        /* To'liq Kengaytirilgan Ko'rinish */
        <>
          <BatteryCard
            battery={telemetry.battery}
            notifyOn80={notifyOn80}
            onToggleLimit={handleToggleLimit}
          />

          {/* Tizim va Power Leak Tablari */}
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center gap-1 p-1 rounded-xl bg-black/30 border border-white/5">
              <button
                onClick={() => setActiveTab('system')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'system'
                    ? 'bg-white/10 text-white font-semibold shadow'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>Telemetriya</span>
              </button>
              <button
                onClick={() => setActiveTab('leaks')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'leaks'
                    ? 'bg-white/10 text-white font-semibold shadow'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Quvvat O'g'rilari</span>
              </button>
            </div>

            {/* Tab Kontenti */}
            <div className="min-h-[105px]">
              {activeTab === 'system' ? (
                <SystemTelemetry system={telemetry.system} />
              ) : (
                <PowerLeakHunter processes={telemetry.system.topProcesses} />
              )}
            </div>
          </div>
        </>
      )}

      {/* Pastki Kichik Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-white/[0.04] text-[10px] text-white/30">
        <div className="flex items-center gap-1">
          <Shield className="w-3 h-3 text-emerald-400/60" />
          <span>Windows 11 Biosphere</span>
        </div>
        <span>Jasper Architecture © 2026</span>
      </div>
      </div>
    </div>
  );
};
