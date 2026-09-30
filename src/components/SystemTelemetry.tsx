import React from 'react';
import { Cpu, Thermometer, HardDrive } from 'lucide-react';
import { SystemData } from '../types';

interface SystemTelemetryProps {
  system: SystemData;
}

export const SystemTelemetry: React.FC<SystemTelemetryProps> = ({ system }) => {
  const getTempColor = (temp: number) => {
    if (temp >= 75) return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
    if (temp >= 55) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
  };

  return (
    <div className="acrylic-subcard rounded-2xl p-3 flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold tracking-wider text-white/50 uppercase">
          Tizim Telemetriyasi
        </span>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-white/5 bg-black/20 text-[10px] text-white/70 font-mono">
          <span>REAL-TIME</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {/* CPU Yuklamasi & Harorati */}
        <div className="bg-black/20 border border-white/5 rounded-xl p-2.5 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-white/50 text-[11px]">
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>CPU</span>
            </div>
            <span className="font-mono text-white text-xs font-semibold">{system.cpuUsage}%</span>
          </div>

          <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, system.cpuUsage)}%` }}
            />
          </div>

          <div className="flex items-center justify-between mt-1 text-[10px]">
            <span className="text-white/40 flex items-center gap-1">
              <Thermometer className="w-3 h-3" />
              Harorat:
            </span>
            <span className={`px-1.5 py-0.5 rounded border text-[10px] font-mono font-medium ${getTempColor(system.cpuTemp)}`}>
              {system.cpuTemp}°C
            </span>
          </div>
        </div>

        {/* RAM Xotira Sarfi */}
        <div className="bg-black/20 border border-white/5 rounded-xl p-2.5 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-white/50 text-[11px]">
            <div className="flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
              <span>Operativ Xotira</span>
            </div>
            <span className="font-mono text-white text-xs font-semibold">{system.memPercent}%</span>
          </div>

          <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-indigo-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, system.memPercent)}%` }}
            />
          </div>

          <div className="flex items-center justify-between mt-1 text-[10px] text-white/40 font-mono">
            <span>Band:</span>
            <span className="text-white/80">
              {system.memUsed}GB / {system.memTotal}GB
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
