import type { Metadata } from 'next';
import Navbar from '@/features/landing/components/Navbar';
import HeroSection from '@/features/landing/components/HeroSection';
import StatsBar from '@/features/landing/components/StatsBar';
import FleetSection from '@/features/landing/components/FleetSection';
import BookingSection from '@/features/landing/components/BookingSection';
import Footer from '@/features/landing/components/Footer';
import AmbientLights from '@/features/landing/components/AmbientLights';

export const metadata: Metadata = {
  title: 'APEX — Luxury Car Rentals',
  description:
    'Experience the pinnacle of automotive luxury. Rent hypercars, supercars, and premium vehicles with white-glove service.',
};

export default function LandingPage() {
  return (
    <main>
      <AmbientLights />
      <Navbar />
      <HeroSection />
      <StatsBar />
      <FleetSection />
      <BookingSection />
      <Footer />
    </main>
  );
}
