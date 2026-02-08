'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const userKeys = ['user1', 'user2', 'user3', 'user4'] as const;

export function Carousel() {
  const t = useTranslations('landing');
  const [center, setCenter] = useState(1);

  function prev() {
    setCenter((c) => (c - 1 + userKeys.length) % userKeys.length);
  }

  function next() {
    setCenter((c) => (c + 1) % userKeys.length);
  }

  return (
    <div className="relative">
      {/* Cards container */}
      <div className="flex items-center justify-center gap-4 overflow-hidden py-4 sm:gap-6">
        {userKeys.map((key, i) => {
          const isCenter = i === center;
          const isAdjacent =
            i === (center - 1 + userKeys.length) % userKeys.length ||
            i === (center + 1) % userKeys.length;

          if (!isCenter && !isAdjacent) return null;

          return (
            <div
              key={key}
              className={`flex shrink-0 flex-col rounded-2xl border p-6 transition-all duration-300 ${
                isCenter
                  ? 'z-10 w-72 scale-105 border-gray-200 bg-white shadow-lg sm:w-80'
                  : 'hidden w-56 scale-95 border-gray-100 bg-gray-50 opacity-60 sm:flex sm:w-64'
              }`}
            >
              {isCenter && (
                <div className="mb-4 h-1.5 w-12 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400" />
              )}
              <p className="text-sm leading-relaxed text-gray-600 italic">
                &ldquo;{t(`testimonials.items.${key}.quote`)}&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-500">
                  {t(`testimonials.items.${key}.name`).charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {t(`testimonials.items.${key}.name`)}
                  </p>
                  <p className="text-xs text-gray-400">{t(`testimonials.items.${key}.role`)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Arrow buttons */}
      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          onClick={prev}
          className="rounded-full border border-gray-200 p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-700"
          aria-label="Previous"
        >
          <ChevronLeft size={18} />
        </button>
        {/* Dot indicators */}
        <div className="flex items-center gap-1.5">
          {userKeys.map((_, i) => (
            <span
              key={i}
              className={`inline-block rounded-full transition-all ${
                i === center ? 'h-2 w-2 bg-gray-900' : 'h-1.5 w-1.5 bg-gray-300'
              }`}
            />
          ))}
        </div>
        <button
          onClick={next}
          className="rounded-full border border-gray-200 p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-700"
          aria-label="Next"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
