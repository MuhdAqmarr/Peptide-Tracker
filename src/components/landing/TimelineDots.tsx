'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

const timelineKeys = ['item1', 'item2', 'item3', 'item4', 'item5'] as const;

export function TimelineDots() {
  const t = useTranslations('landing');
  const [active, setActive] = useState(0);

  return (
    <div className="mt-12">
      {/* Caption panel */}
      <div className="mb-8 min-h-[60px]">
        <p className="text-sm font-semibold text-gray-800">
          {t(`technology.timeline.${timelineKeys[active]}.label`)}
        </p>
        <p className="mt-1 max-w-lg text-sm leading-relaxed text-gray-500">
          {t(`technology.timeline.${timelineKeys[active]}.caption`)}
        </p>
      </div>

      {/* Dots */}
      <div className="flex items-center gap-3">
        {timelineKeys.map((key, i) => (
          <button
            key={key}
            onClick={() => setActive(i)}
            className="group flex flex-col items-center gap-2"
            aria-label={t(`technology.timeline.${key}.label`)}
          >
            <span
              className={`inline-block rounded-full transition-all ${
                i === active
                  ? 'h-3.5 w-3.5 bg-gray-900'
                  : 'h-2.5 w-2.5 bg-gray-300 group-hover:bg-gray-500'
              }`}
            />
            <span
              className={`text-xs transition-colors ${
                i === active ? 'font-medium text-gray-900' : 'text-gray-400 group-hover:text-gray-600'
              }`}
            >
              {t(`technology.timeline.${key}.label`)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
