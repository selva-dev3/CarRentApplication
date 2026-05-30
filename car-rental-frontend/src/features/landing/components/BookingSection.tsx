'use client';

import { useState } from 'react';

export default function BookingSection() {
  const [confirmed, setConfirmed] = useState(false);

  const handleReserve = () => {
    setConfirmed(true);
    setTimeout(() => setConfirmed(false), 3000);
  };

  return (
    <section id="booking" className="py-24 px-6 md:px-16 bg-[var(--bg2)]">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="text-xs tracking-[3px] uppercase text-accent font-semibold mb-3">
          Quick Reservation
        </div>
        <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] tracking-[2px]">
          BOOK YOUR DRIVE
        </h2>
      </div>

      {/* Widget */}
      <div className="max-w-[900px] mx-auto bg-glass border border-glass-border rounded-2xl p-8 md:p-12 backdrop-blur-[20px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Vehicle */}
          <div>
            <label className="block text-[0.7rem] tracking-[2px] uppercase text-dim mb-2 font-medium">
              Select Vehicle
            </label>
            <select className="w-full bg-[rgba(255,255,255,0.04)] border border-glass-border text-[var(--text)] px-4 py-3 rounded-lg font-body text-sm outline-none transition-colors focus:border-accent [&>option]:bg-[var(--bg2)] [&>option]:text-[var(--text)]">
              <option>Ferrari SF90 Stradale</option>
              <option>Lamborghini Huracán EVO</option>
              <option>Porsche 911 GT3 RS</option>
              <option>Range Rover Sport</option>
            </select>
          </div>

          {/* Pick-up */}
          <div>
            <label className="block text-[0.7rem] tracking-[2px] uppercase text-dim mb-2 font-medium">
              Pick-up Date
            </label>
            <input
              type="date"
              className="w-full bg-[rgba(255,255,255,0.04)] border border-glass-border text-[var(--text)] px-4 py-3 rounded-lg font-body text-sm outline-none transition-colors focus:border-accent"
            />
          </div>

          {/* Return */}
          <div>
            <label className="block text-[0.7rem] tracking-[2px] uppercase text-dim mb-2 font-medium">
              Return Date
            </label>
            <input
              type="date"
              className="w-full bg-[rgba(255,255,255,0.04)] border border-glass-border text-[var(--text)] px-4 py-3 rounded-lg font-body text-sm outline-none transition-colors focus:border-accent"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-[0.7rem] tracking-[2px] uppercase text-dim mb-2 font-medium">
              Location
            </label>
            <select className="w-full bg-[rgba(255,255,255,0.04)] border border-glass-border text-[var(--text)] px-4 py-3 rounded-lg font-body text-sm outline-none transition-colors focus:border-accent [&>option]:bg-[var(--bg2)] [&>option]:text-[var(--text)]">
              <option>Dubai Marina</option>
              <option>Monaco</option>
              <option>Beverly Hills</option>
              <option>London Mayfair</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleReserve}
          className={`w-full border-none py-4 font-body text-sm font-bold tracking-[2px] uppercase rounded-lg cursor-pointer transition-all duration-400 ${
            confirmed
              ? 'bg-green-600 text-white'
              : 'bg-accent text-white hover:shadow-[0_10px_40px_var(--accent-glow)] hover:-translate-y-0.5'
          }`}
        >
          {confirmed ? '✓ Reservation Confirmed!' : 'Reserve This Vehicle'}
        </button>
      </div>
    </section>
  );
}
