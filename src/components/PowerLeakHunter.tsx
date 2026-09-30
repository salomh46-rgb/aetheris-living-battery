import React from 'react';
import { AlertCircle, Flame } from 'lucide-react';
import { ProcessData } from '../types';

interface PowerLeakHunterProps {
  processes: ProcessData[];
}

export const PowerLeakHunter: React.FC<PowerLeakHunterProps> = ({ processes }) => {
  return (
    <div className="acrylic-subcard rounded-2xl p-3 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-white/50 text-[11px] font-semibold uppercase tracking-wider">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>Quvvat Sarflovchi Dasturlar</span>
        </div>
        <span className="text-[10px] text-white/40">CPU %</span>
      </div>

      <div className="flex flex-col gap-1.5">
        {processes && processes.length > 0 ? (
          processes.map((proc, idx) => (
            <div
              key={`${proc.pid}-${idx}`}
              className="flex items-center justify-between py-1 px-2 rounded-lg bg-black/20 hover:bg-black/40 transition-colors border border-white/[0.03]"
            >
              <div className="flex items-center gap-2 truncate max-w-[210px]">
                <span className="text-[10px] text-white/30 font-mono w-3.5">{idx + 1}.</span>
                <span className="text-xs text-white/90 truncate font-medium">{proc.name}</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span
                  className={`${
                    proc.cpu > 20
                      ? 'text-rose-400 font-bold'
                      : proc.cpu > 5
                      ? 'text-amber-400'
                      : 'text-white/60'
                  }`}
                >
                  {proc.cpu}%
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center gap-2 py-3 text-white/40 text-xs">
            <AlertCircle className="w-4 h-4 text-emerald-400" />
            <span>Ortiqcha fon sarflari aniqlanmadi</span>
          </div>
        )}
      </div>
    </div>
  );
};
