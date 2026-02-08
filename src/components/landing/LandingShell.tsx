'use client';

import { BioBackground } from './BioBackground';
import { TopBar } from './TopBar';
import { HeroSection } from './HeroSection';
import { FeatureSection } from './FeatureSection';
import { TechnologySection } from './TechnologySection';
import { TestimonialsSection } from './TestimonialsSection';
import { PricingSection } from './PricingSection';
import { ContactSection } from './ContactSection';

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
