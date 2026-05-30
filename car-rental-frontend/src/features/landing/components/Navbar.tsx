'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/store/authStore';

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout, isHydrated } = useAuthStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push(`/#${id}`);
    }
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    setMobileOpen(false);
  };

  const dashboardUrl = user?.role === 'admin' || user?.role === 'superadmin' 
    ? '/admin/dashboard' 
    : '/dashboard';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-12 py-4 transition-all duration-300 border-b border-glass-border ${
        scrolled ? 'bg-[rgba(10,10,12,0.85)] backdrop-blur-xl' : 'bg-[rgba(10,10,12,0.6)] backdrop-blur-[20px]'
      }`}
    >
      <Link href="/" className="font-display text-3xl tracking-[4px] text-[var(--text)] no-underline">
        APE<span className="text-accent">X</span>
      </Link>

      {/* Desktop links */}
      <ul className="hidden md:flex gap-8 list-none items-center m-0 p-0">
        <li>
          <button
            onClick={() => scrollTo('fleet')}
            className="text-dim text-sm tracking-[1.5px] uppercase font-medium hover:text-accent transition-colors bg-transparent border-none cursor-pointer"
          >
            Fleet
          </button>
        </li>
        <li>
          <button
            onClick={() => scrollTo('booking')}
            className="text-dim text-sm tracking-[1.5px] uppercase font-medium hover:text-accent transition-colors bg-transparent border-none cursor-pointer"
          >
            Reserve
          </button>
        </li>
        {isHydrated && user && (
          <li>
            <Link
              href={dashboardUrl}
              className="text-dim text-sm tracking-[1.5px] uppercase font-medium hover:text-accent transition-colors no-underline"
            >
              Dashboard
            </Link>
          </li>
        )}
      </ul>

      {/* Desktop Auth Actions */}
      <div className="hidden md:flex items-center gap-4">
        {isHydrated && user ? (
          <>
            <span className="text-xs text-dim font-body">Hello, {user.name.split(' ')[0]}</span>
            <button
              onClick={handleLogout}
              className="bg-transparent border border-glass-border text-[var(--text)] px-5 py-2 font-body text-xs font-semibold tracking-[1.5px] uppercase cursor-pointer rounded-md transition-all hover:border-accent hover:text-accent"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="text-dim text-sm tracking-[1.5px] uppercase font-medium hover:text-accent transition-colors no-underline"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-accent text-white border-none px-6 py-2.5 font-body text-xs font-semibold tracking-[1.5px] uppercase cursor-pointer rounded-md transition-all hover:scale-105 hover:shadow-[0_0_30px_var(--accent-glow)] no-underline"
            >
              Get Started
            </Link>
          </>
        )}
      </div>

      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden bg-transparent border-none text-[var(--text)] text-2xl cursor-pointer"
        aria-label="Menu"
      >
        {mobileOpen ? '✕' : '☰'}
      </button>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 bg-[rgba(10,10,12,0.95)] border-b border-glass-border p-6 flex flex-col gap-4 md:hidden backdrop-blur-xl">
          <button onClick={() => scrollTo('fleet')} className="text-dim text-sm tracking-[1.5px] uppercase font-medium hover:text-accent transition-colors bg-transparent border-none cursor-pointer text-left">Fleet</button>
          <button onClick={() => scrollTo('booking')} className="text-dim text-sm tracking-[1.5px] uppercase font-medium hover:text-accent transition-colors bg-transparent border-none cursor-pointer text-left">Reserve</button>
          
          {isHydrated && user ? (
            <>
              <Link
                href={dashboardUrl}
                onClick={() => setMobileOpen(false)}
                className="text-dim text-sm tracking-[1.5px] uppercase font-medium hover:text-accent transition-colors no-underline"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-accent text-white border-none px-6 py-2.5 font-body text-xs font-semibold tracking-[1.5px] uppercase cursor-pointer rounded-md mt-2 text-center"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="text-dim text-sm tracking-[1.5px] uppercase font-medium hover:text-accent transition-colors no-underline py-2"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="bg-accent text-white border-none px-6 py-2.5 font-body text-xs font-semibold tracking-[1.5px] uppercase cursor-pointer rounded-md mt-2 text-center no-underline"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
