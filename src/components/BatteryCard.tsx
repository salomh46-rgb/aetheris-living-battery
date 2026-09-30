import React from 'react';
import { Zap, BatteryCharging, Battery, Clock, RotateCcw, ShieldCheck, HeartPulse } from 'lucide-react';
import { BatteryData } from '../types';

interface BatteryCardProps {
  battery: BatteryData;
  notifyOn80: boolean;
  onToggleLimit: (val: boolean) => void;
}

export const BatteryCard: React.FC<BatteryCardProps> = ({
  battery,
  notifyOn80,
  onToggleLimit,
}) => {
  // Format vaqt
  const formatTime = (minutes: number) => {
    if (!minutes || minutes <= 0) return 'Hisoblanmoqda...';
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs === 0) return `${mins} daqiqa`;
    return `${hrs}s ${mins}m`;
  };

  // Batareya salomatligi (taxminiy hisob)
  const healthPercent = battery.maxCapacity && battery.designedCapacity && battery.designedCapacity > 0
    ? Math.min(100, Math.round((battery.maxCapacity / battery.designedCapacity) * 100))
    : 96;

  return (
    <div className="flex flex-col gap-3">
      {/* Asosiy Zaryad Ko'rsatkichi */}
      <div className="acrylic-subcard rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              battery.isCharging
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 glow-emerald'
                : battery.percent <= 20
                ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                : 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
            }`}
          >
            {battery.isCharging ? (
              <Zap className="w-6 h-6 animate-pulse" />
            ) : (
              <Battery className="w-6 h-6" />
            )}
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold tracking-tight text-white font-mono">
                {battery.percent}%
              </span>
              <span className="text-xs text-white/50 font-medium">
                {battery.isCharging ? 'Zaryadlanmoqda' : 'Batareyada'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-white/60 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-white/40" />
              <span>
                {battery.isCharging ? "To'lishiga: " : "Qolgan vaqt: "}
                <span className="text-white/90 font-medium">
                  {formatTime(battery.timeRemaining)}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* 80% Smart Limit Toggle */}
        <button
          onClick={() => onToggleLimit(!notifyOn80)}
          className={`flex flex-col items-end p-2 rounded-xl transition-all border ${
            notifyOn80
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-white/5 border-white/10 text-white/40'
          }`}
          title="80% ga yetganda ogohlantirish"
        >
          <div className="flex items-center gap-1 text-[11px] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>80% Limit</span>
          </div>
          <span className="text-[10px] opacity-70">
            {notifyOn80 ? 'Faol' : "O'chiq"}
          </span>
        </button>
      </div>

      {/* Mini Metrikalar Paneli (Health, Cycles, Capacity) */}
      <div className="grid grid-cols-3 gap-2">
        <div className="acrylic-subcard rounded-xl p-2.5 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1 text-white/40 text-[10px] font-medium mb-0.5">
            <HeartPulse className="w-3 h-3 text-emerald-400" />
            <span>Salomatlik</span>
          </div>
          <span className="text-sm font-bold text-white font-mono">{healthPercent}%</span>
          <span className="text-[9px] text-emerald-400/80">Ideal holat</span>
        </div>

        <div className="acrylic-subcard rounded-xl p-2.5 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1 text-white/40 text-[10px] font-medium mb-0.5">
            <RotateCcw className="w-3 h-3 text-cyan-400" />
            <span>Tsikllar</span>
          </div>
          <span className="text-sm font-bold text-white font-mono">{battery.cycleCount}</span>
          <span className="text-[9px] text-white/40">Zaryad davri</span>
        </div>

        <div className="acrylic-subcard rounded-xl p-2.5 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1 text-white/40 text-[10px] font-medium mb-0.5">
            <BatteryCharging className="w-3 h-3 text-amber-400" />
            <span>Turi</span>
          </div>
          <span className="text-sm font-bold text-white truncate max-w-[85px]">
            {battery.type || 'Li-Ion'}
          </span>
          <span className="text-[9px] text-white/40">Kimyoviy</span>
        </div>
      </div>
    </div>
  );
};
