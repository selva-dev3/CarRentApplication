'use client';

import { useEffect, useRef } from 'react';

const stats = [
  { value: '2.9', unit: 's', label: '0–60 MPH' },
  { value: '211', unit: ' mph', label: 'Top Speed' },
  { value: '710', unit: ' hp', label: 'Horsepower' },
  { value: '$950', unit: '/day', label: 'Starting Rate' },
];

export default function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('opacity-100', 'translate-y-0');
          el.classList.remove('opacity-0', 'translate-y-6');
          obs.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative z-10 mx-6 md:mx-16 -mt-12 grid grid-cols-2 md:grid-cols-4 bg-glass backdrop-blur-[30px] border border-glass-border rounded-2xl py-8 shadow-[0_20px_60px_rgba(0,0,0,0.4)] opacity-0 translate-y-6 transition-all duration-700"
    >
      {stats.map((s, i) => (
        <div
          key={s.label}
          className={`text-center px-8 py-4 ${
            i < stats.length - 1 ? 'md:border-r border-b md:border-b-0 border-glass-border' : ''
          }`}
        >
          <div className="font-display text-4xl tracking-[2px] text-[var(--text)]">
            {s.value}
            <span className="text-accent">{s.unit}</span>
          </div>
          <div className="text-[0.7rem] tracking-[2px] uppercase text-dim mt-1">
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}
