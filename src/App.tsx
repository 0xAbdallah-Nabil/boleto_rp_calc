import React, { useState, useMemo } from 'react';

import type { CalcResult,Job, Good } from './types/index';
import { JOBS } from './data/jobs';
import { getTotalRP } from './data/rpData';
import JobCard from './components/JobCard';
import ResultPanel from './components/ResultPanel';

const App: React.FC = () => {
  const [startLevel, setStartLevel] = useState<string>('0');
  const [endLevel, setEndLevel] = useState<string>('50');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedGood, setSelectedGood] = useState<Good | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<'port' | 'airport' | null>(null);
  const [result, setResult] = useState<CalcResult | null>(null);
  const [error, setError] = useState<string>('');

  const currentLevel = parseInt(startLevel) || 0;

  const filteredJobs = useMemo(
    () => JOBS.filter((j) => j.name.includes(searchQuery)),
    [searchQuery]
  );

  const handleSelectJob = (job: Job) => {
    setSelectedJob(job);
    setSelectedGood(job.goods.length === 1 ? job.goods[0] : null);
    setSelectedLocation(null);
    setResult(null);
    setError('');
  };

  const handleSelectGood = (good: Good) => {
    setSelectedGood(good);
    setSelectedLocation(null);
  };

  const handleSelectLocation = (loc: 'port' | 'airport') => {
    setSelectedLocation(loc);
  };

  const handleStartLevelChange = (val: string) => {
    setStartLevel(val);
    setSelectedJob(null);
    setSelectedGood(null);
    setSelectedLocation(null);
    setResult(null);
    setError('');
  };

  const calculate = () => {
    const from = parseInt(startLevel);
    const to = parseInt(endLevel);

    if (isNaN(from) || isNaN(to)) { setError('الرجاء إدخال المستويات بشكل صحيح'); return; }
    if (from < 0 || to < 1) { setError('قيم المستويات غير صحيحة'); return; }
    if (from >= to) { setError('المستوى المستهدف يجب أن يكون أكبر من المستوى الحالي'); return; }
    if (to > 500) { setError('أقصى مستوى مدعوم هو 500'); return; }
    if (!selectedJob) { setError('الرجاء اختيار شركة'); return; }

    const job = selectedJob;
    const good = selectedGood ?? job.goods[0];

    let xpPerGood: number;
    let locationName: string;

    if (job.locationType === 'outside') {
      xpPerGood = good.outside ?? 0;
      locationName = 'خارج الميناء';
    } else {
      if (!selectedLocation) { setError('الرجاء اختيار مكان البيع (ميناء أو مطار)'); return; }
      xpPerGood = selectedLocation === 'port' ? (good.port ?? 0) : (good.airport ?? 0);
      locationName = selectedLocation === 'port' ? 'الميناء' : 'المطار';
      if (!xpPerGood) { setError('هذا الخيار غير متاح لهذه البضاعة'); return; }
    }

    const totalRP = getTotalRP(from, to);
    const goodsNeeded = Math.ceil(totalRP / xpPerGood);

    setError('');
    const result: any = {
      totalRP, goodsNeeded, xpPerGood,
      startLevel: from, endLevel: to,
      jobName: job.name, goodName: good.name, locationName,
    };

    // إذا كانت الأحجار النظيفة، حساب المعادن
    if (good.name === 'الاحجار النظيفة' && good.copper && good.iron && good.gold) {
      result.copper = goodsNeeded * good.copper;
      result.iron = goodsNeeded * good.iron;
      result.gold = goodsNeeded * good.gold;
    }

    setResult(result);
  };

  return (
    <div dir="rtl" className="min-h-screen py-8 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2 enhanced-text">🎮 Boleto RP Calculator</div>
          <h1 className="text-2xl font-bold text-white"> </h1>
          <p className="text-sm text-blue-200 mt-1">احسب الخبرة والبضائع اللازمة للوصول للمستوى المطلوب</p>
        </div>

        <div className="card-enhanced p-5 mb-4">
          <h2 className="text-sm font-medium text-blue-200 mb-3">المستويات</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-blue-300 block mb-1.5">المستوى الحالي</label>
              <input
                type="number" min={0} max={499} value={startLevel}
                onChange={(e) => handleStartLevelChange(e.target.value)}
                className="w-full bg-slate-800/50 border border-blue-500/50 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                placeholder="0"
              />
            </div>
            <div>
              <label className="text-xs text-blue-300 block mb-1.5">المستوى المستهدف</label>
              <input
                type="number" min={1} max={500} value={endLevel}
                onChange={(e) => { setEndLevel(e.target.value); setResult(null); setError(''); }}
                className="w-full bg-slate-800/50 border border-blue-500/50 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                placeholder="50"
              />
            </div>
          </div>
        </div>

        <div className="card-enhanced p-5 mb-4">
          <h2 className="text-sm font-medium text-blue-200 mb-3">اختر الشركة</h2>
          <input
            type="text" value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن شركة..."
            className="w-full bg-slate-800/50 border border-blue-500/50 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 mb-3"
          />
          <div className="max-h-80 overflow-y-auto pr-1">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isSelected={selectedJob?.id === job.id}
                isLocked={job.minLevel > currentLevel}
                selectedGood={selectedJob?.id === job.id ? selectedGood : null}
                selectedLocation={selectedJob?.id === job.id ? selectedLocation : null}
                onSelect={handleSelectJob}
                onSelectGood={handleSelectGood}
                onSelectLocation={handleSelectLocation}
              />
            ))}
            {filteredJobs.length === 0 && (
              <p className="text-center text-sm text-slate-400 py-6">لا توجد نتائج</p>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-900/40 border border-red-500/50 rounded-xl px-4 py-3 text-sm text-red-300 mb-4">
            ⚠️ {error}
          </div>
        )}

        <button
          onClick={calculate}
          className="btn-enhanced w-full"
        >
          احسب الآن ←
        </button>

        {result && <ResultPanel result={result} />}
      </div>
      <div className="max-w-lg mx-auto mt-8 text-center text-slate-300 text-xs">
        <p>
          developed by <a href="https://github.com/0xAbdallah-Nabil" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">Abdallah Nabil </a>
        </p>
          <div className="text-center mt-6 text-xs text-slate-400">
            <p>© 2026 Abdallah Nabil. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </div>
  );
};

export default App;
