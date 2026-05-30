'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAuthStore } from '@/features/auth/store/authStore';

export default function HeroSection() {
  const { user, isHydrated } = useAuthStore();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const dashboardUrl = user?.role === 'admin' || user?.role === 'superadmin'
    ? '/admin/dashboard'
    : '/dashboard';

  return (
    <section className="relative min-h-screen grid grid-cols-1 lg:grid-cols-2 items-center px-6 md:px-16 pt-32 pb-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.png"
          alt=""
          fill
          className="object-cover opacity-35"
          priority
        />
      </div>
      <div className="absolute inset-0 z-[1] bg-gradient-to-br from-[rgba(10,10,12,0.95)] via-[rgba(10,10,12,0.6)] to-[rgba(10,10,12,0.8)]" />

      {/* Content */}
      <div className="relative z-[2] lg:pr-8 text-center lg:text-left">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-glass border border-glass-border rounded-full px-4 py-2 mb-8 backdrop-blur-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse2" />
          <span className="text-xs tracking-[2px] uppercase text-dim">
            Now Available — 2026 Season
          </span>
        </div>

        <h1 className="font-display text-[clamp(3rem,7vw,6.5rem)] leading-[0.95] tracking-[2px] mb-6">
          REDISCOVER<br />SPEED.<br />
          <span className="text-accent block">REDEFINE LUXURY.</span>
        </h1>

        <p className="text-base leading-relaxed text-dim max-w-[480px] mb-10 mx-auto lg:mx-0">
          Step into the world&apos;s most exclusive automotive experiences. Handpicked
          hypercars and luxury vehicles, delivered to your door with white-glove precision.
        </p>

        <div className="flex gap-4 flex-wrap justify-center lg:justify-start">
          {isHydrated && user ? (
            <>
              <Link
                href={dashboardUrl}
                className="bg-accent text-white border-none px-8 py-4 font-body text-sm font-semibold tracking-[2px] uppercase cursor-pointer rounded-lg transition-all duration-400 hover:-translate-y-0.5 hover:shadow-[0_10px_40px_var(--accent-glow)] no-underline"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={() => scrollTo('fleet')}
                className="bg-transparent text-[var(--text)] border border-glass-border px-8 py-4 font-body text-sm font-medium tracking-[2px] uppercase cursor-pointer rounded-lg transition-all duration-400 backdrop-blur-[10px] hover:border-accent hover:text-accent"
              >
                Explore the Fleet
              </button>
            </>
          ) : (
            <>
              <Link
                href="/register"
                className="bg-accent text-white border-none px-8 py-4 font-body text-sm font-semibold tracking-[2px] uppercase cursor-pointer rounded-lg transition-all duration-400 hover:-translate-y-0.5 hover:shadow-[0_10px_40px_var(--accent-glow)] no-underline"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="bg-transparent text-[var(--text)] border border-glass-border px-8 py-4 font-body text-sm font-medium tracking-[2px] uppercase cursor-pointer rounded-lg transition-all duration-400 backdrop-blur-[10px] hover:border-accent hover:text-accent no-underline"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Car Visual */}
      <div className="relative z-[2] flex items-center justify-center mt-8 lg:mt-0">
        <div className="w-full max-w-[650px] relative">
          <Image
            src="/images/showcase-car.png"
            alt="Ferrari SF90 Stradale"
            width={650}
            height={450}
            className="w-full h-auto drop-shadow-[0_20px_60px_rgba(0,0,0,0.6)] animate-float"
            priority
          />
          {/* Glow */}
          <div className="absolute -bottom-[20%] left-[10%] right-[10%] h-[60%] bg-[radial-gradient(ellipse,var(--accent-glow)_0%,transparent_70%)] blur-[60px] -z-[1]" />
        </div>
      </div>
    </section>
  );
}
