import React from 'react';
import type{ Job, Good } from '../types/index.ts';

interface JobCardProps {
  job: Job;
  isSelected: boolean;
  isLocked: boolean;
  selectedGood: Good | null;
  selectedLocation: 'port' | 'airport' | null;
  onSelect: (job: Job) => void;
  onSelectGood: (good: Good) => void;
  onSelectLocation: (loc: 'port' | 'airport') => void;
}

const JobCard: React.FC<JobCardProps> = ({
  job, isSelected, isLocked, selectedGood, selectedLocation,
  onSelect, onSelectGood, onSelectLocation,
}) => {
  const activeGood = selectedGood ?? job.goods[0];

  return (
    <div
      onClick={() => !isLocked && onSelect(job)}
      className={[
        'rounded-xl border transition-all duration-150 mb-3 overflow-hidden',
        isLocked
          ? 'border-slate-700 opacity-50 cursor-not-allowed bg-slate-900/40'
          : isSelected
          ? 'border-blue-500/60 bg-blue-900/30 cursor-pointer'
          : 'border-slate-700/60 bg-slate-800/50 hover:border-blue-500/50 cursor-pointer',
      ].join(' ')}
    >
      <div className="p-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={[
              'text-xs font-medium px-2 py-0.5 rounded-md',
              isLocked
                ? 'bg-red-900/40 text-red-300'
                : 'bg-emerald-900/40 text-emerald-300',
            ].join(' ')}
          >
            {isLocked ? `🔒 مستوى ${job.minLevel}` : '✓ متاح'}
          </span>
          <span className="text-sm font-medium text-blue-100">{job.name}</span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          {job.locationType === 'outside' ? 'خارج الميناء' : 'ميناء / مطار'} ·{' '}
          {job.goods.map((g) => g.name).join('، ')}
        </p>
      </div>

      {isSelected && (
        <div
          className="px-4 pb-4 border-t border-blue-900/50 pt-3 space-y-3"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Good selector (only for multi-good jobs like minerals) */}
          {job.goods.length > 1 && (
            <div>
              <p className="text-xs text-slate-400 mb-2">نوع البضاعة:</p>
              <div className="flex flex-wrap gap-2">
                {job.goods.map((g) => (
                  <button
                    key={g.name}
                    onClick={() => onSelectGood(g)}
                    className={[
                      'text-xs px-3 py-1.5 rounded-lg border transition-all',
                      activeGood.name === g.name
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-slate-800/50 text-slate-300 border-slate-700/60 hover:border-slate-600',
                    ].join(' ')}
                  >
                    {g.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Location selector */}
          {job.locationType === 'port_airport' && (
            <div>
              <p className="text-xs text-slate-400 mb-2">مكان البيع:</p>
              <div className="flex flex-wrap gap-2">
                {(activeGood.port ?? 0) > 0 && (
                  <button
                    onClick={() => onSelectLocation('port')}
                    className={[
                      'text-xs px-3 py-1.5 rounded-lg border transition-all',
                      selectedLocation === 'port'
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-slate-800/50 text-slate-300 border-slate-700/60 hover:border-slate-600',
                    ].join(' ')}
                  >
                    ⚓ الميناء ({activeGood.port} خبرة)
                  </button>
                )}
                {(activeGood.airport ?? 0) > 0 && (
                  <button
                    onClick={() => onSelectLocation('airport')}
                    className={[
                      'text-xs px-3 py-1.5 rounded-lg border transition-all',
                      selectedLocation === 'airport'
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-slate-800/50 text-slate-300 border-slate-700/60 hover:border-slate-600',
                    ].join(' ')}
                  >
                    ✈️ المطار ({activeGood.airport} خبرة)
                  </button>
                )}
              </div>
            </div>
          )}

          {job.locationType === 'outside' && (
            <p className="text-xs text-slate-400">
              خارج الميناء · {activeGood.outside} خبرة لكل بضاعة
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default JobCard;
