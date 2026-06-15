import React from 'react';
import type{ CalcResult } from '../types/index.ts';

interface ResultPanelProps {
  result: CalcResult;
}

const ResultPanel: React.FC<ResultPanelProps> = ({ result }) => {
  const { totalRP, goodsNeeded, xpPerGood, startLevel, endLevel, jobName, goodName, locationName } = result;

  return (
    <div className="card-enhanced p-5 mt-4">
      <h2 className="text-base font-medium text-blue-200 mb-4">نتائج الحساب</h2>

      {/* Metric cards */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-3 text-center">
          <p className="text-xs text-blue-300 mb-1">إجمالي الخبرة</p>
          <p className="text-xl font-medium text-blue-100">{totalRP.toLocaleString('ar-EG')}</p>
          <p className="text-xs text-blue-400">نقطة</p>
        </div>
        <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-xl p-3 text-center">
          <p className="text-xs text-emerald-300 mb-1">عدد البضائع</p>
          <p className="text-xl font-medium text-emerald-100">{goodsNeeded.toLocaleString('ar-EG')}</p>
          <p className="text-xs text-emerald-400">بضاعة</p>
        </div>
        <div className="bg-amber-900/30 border border-amber-500/30 rounded-xl p-3 text-center">
          <p className="text-xs text-amber-300 mb-1">خبرة / بضاعة</p>
          <p className="text-xl font-medium text-amber-100">{xpPerGood}</p>
          <p className="text-xs text-amber-400">نقطة</p>
        </div>
      </div>

      {/* Detail rows */}
      <div className="divide-y divide-slate-700/50 text-sm">
        <DetailRow label="من مستوى" value={String(startLevel)} />
        <DetailRow label="إلى مستوى" value={String(endLevel)} />
        <DetailRow label="الشركة" value={jobName} />
        {goodName !== 'خبرة' && <DetailRow label="نوع البضاعة" value={goodName} />}
        <DetailRow label="مكان البيع" value={locationName} />
      </div>
    </div>
  );
};

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-2.5">
    <span className="text-slate-400">{label}</span>
    <span className="text-slate-200 font-medium">{value}</span>
  </div>
);

export default ResultPanel;
