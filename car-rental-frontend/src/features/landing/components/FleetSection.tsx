'use client';

import { useState } from 'react';
import Image from 'next/image';

const cars = [
  {
    name: 'Ferrari SF90 Stradale',
    type: 'Hybrid Hypercar • 2025',
    cat: 'hyper',
    badge: 'Hypercar',
    img: '/images/showcase-car.png',
    hp: '986',
    accel: '2.5s',
    speed: '211',
    price: '$1,200',
  },
  {
    name: 'Lamborghini Huracán EVO',
    type: 'V10 Supercar • 2025',
    cat: 'super',
    badge: 'Supercar',
    img: '/images/fleet-lambo.png',
    hp: '640',
    accel: '2.9s',
    speed: '202',
    price: '$950',
  },
  {
    name: 'Porsche 911 GT3 RS',
    type: 'Track Weapon • 2025',
    cat: 'super',
    badge: 'Supercar',
    img: '/images/fleet-porsche.png',
    hp: '518',
    accel: '3.0s',
    speed: '184',
    price: '$750',
  },
  {
    name: 'Range Rover Sport',
    type: 'Luxury SUV • 2025',
    cat: 'luxury',
    badge: 'Luxury SUV',
    img: '/images/fleet-rover.png',
    hp: '523',
    accel: '4.3s',
    speed: '155',
    price: '$550',
  },
];

const tabs = [
  { id: 'all', label: 'All Vehicles' },
  { id: 'hyper', label: 'Hypercars' },
  { id: 'super', label: 'Supercars' },
  { id: 'luxury', label: 'Luxury SUVs' },
];

export default function FleetSection() {
  const [active, setActive] = useState('all');

  const filtered = active === 'all' ? cars : cars.filter((c) => c.cat === active);

  const scrollToBooking = (carName: string) => {
    const el = document.getElementById('booking');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="fleet" className="py-24 px-6 md:px-16">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="text-xs tracking-[3px] uppercase text-accent font-semibold mb-3">
          Our Collection
        </div>
        <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] tracking-[2px]">
          THE FLEET
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-2 mb-12 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`px-5 py-2 rounded-full text-xs font-medium tracking-[1px] uppercase cursor-pointer transition-all duration-300 border ${
              active === tab.id
                ? 'bg-accent text-white border-accent'
                : 'bg-glass text-dim border-glass-border hover:bg-accent hover:text-white hover:border-accent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((car) => (
          <div
            key={car.name}
            className="bg-glass border border-glass-border rounded-2xl overflow-hidden transition-all duration-400 cursor-pointer hover:-translate-y-2 hover:border-[rgba(232,52,28,0.3)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] group"
          >
            {/* Image */}
            <div className="relative h-[200px] overflow-hidden bg-[var(--bg2)]">
              <Image
                src={car.img}
                alt={car.name}
                fill
                className="object-cover transition-transform duration-600 group-hover:scale-[1.08]"
              />
              <span className="absolute top-3 left-3 bg-accent text-white text-[0.65rem] font-bold tracking-[1.5px] uppercase px-2.5 py-1 rounded">
                {car.badge}
              </span>
            </div>

            {/* Body */}
            <div className="p-5">
              <h3 className="font-display text-xl tracking-[1px] mb-1">{car.name}</h3>
              <p className="text-xs text-dim tracking-[1px] uppercase mb-4">{car.type}</p>

              {/* Specs */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { val: car.hp, lbl: 'HP' },
                  { val: car.accel, lbl: '0-60' },
                  { val: car.speed, lbl: 'MPH' },
                ].map((s) => (
                  <div
                    key={s.lbl}
                    className="text-center py-2 bg-[rgba(255,255,255,0.02)] rounded-lg border border-[rgba(255,255,255,0.04)]"
                  >
                    <div className="font-display text-base tracking-[1px]">{s.val}</div>
                    <div className="text-[0.6rem] text-dim tracking-[1px] uppercase mt-0.5">
                      {s.lbl}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-glass-border">
                <div className="font-display text-xl tracking-[1px]">
                  {car.price} <span className="text-xs text-dim font-body tracking-normal">/day</span>
                </div>
                <button
                  onClick={() => scrollToBooking(car.name)}
                  className="bg-accent text-white border-none px-4 py-2 font-body text-[0.7rem] font-semibold tracking-[1.5px] uppercase rounded-md cursor-pointer transition-all hover:shadow-[0_0_25px_var(--accent-glow)] hover:scale-105"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
