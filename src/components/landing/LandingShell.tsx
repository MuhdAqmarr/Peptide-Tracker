'use client';

import dynamic from 'next/dynamic';
import { BioBackground } from './BioBackground';
import { TopBar } from './TopBar';
import { HeroSection } from './HeroSection';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy-load below-the-fold sections — they're not needed on initial render
const SectionFallback = () => (
  <div className="px-6 py-12 sm:px-10">
    <Skeleton className="mx-auto h-6 w-32" />
    <Skeleton className="mx-auto mt-2 h-8 w-64" />
    <Skeleton className="mx-auto mt-4 h-40 w-full max-w-2xl rounded-xl" />
  </div>
);

const FeatureSection = dynamic(() => import('./FeatureSection').then(m => ({ default: m.FeatureSection })), {
  loading: SectionFallback,
});
const TechnologySection = dynamic(() => import('./TechnologySection').then(m => ({ default: m.TechnologySection })), {
  loading: SectionFallback,
});
const TestimonialsSection = dynamic(() => import('./TestimonialsSection').then(m => ({ default: m.TestimonialsSection })), {
  loading: SectionFallback,
});
const PricingSection = dynamic(() => import('./PricingSection').then(m => ({ default: m.PricingSection })), {
  loading: SectionFallback,
});
const ContactSection = dynamic(() => import('./ContactSection').then(m => ({ default: m.ContactSection })), {
  loading: SectionFallback,
});

export function LandingShell() {
  return (
    <div className="relative min-h-screen bg-gray-100/50">
      <BioBackground />
      <div className="relative z-10">
      <TopBar />

      {/* Centered white canvas */}
      <div className="mx-auto my-4 max-w-6xl sm:my-8">
        <div className="overflow-hidden rounded-none bg-white shadow-sm sm:rounded-3xl sm:shadow-lg">
          <HeroSection />
          <div className="mx-6 border-t border-gray-100 sm:mx-10" />
          <FeatureSection />
          <div className="mx-6 border-t border-gray-100 sm:mx-10" />
          <TechnologySection />
          <TestimonialsSection />
          <div className="mx-6 border-t border-gray-100 sm:mx-10" />
          <PricingSection />
          <div className="mx-6 border-t border-gray-100 sm:mx-10" />
          <ContactSection />
        </div>
      </div>
      </div>
    </div>
  );
}
