/** Predefined subcutaneous injection sites for rotation planning. */

export type InjectionSite = {
  id: string;
  label: string;
  labelMs: string;
  /** SVG coordinates (percentage-based, 0-100) for body map placement */
  x: number;
  y: number;
  side: 'left' | 'right' | 'center';
  region: 'abdomen' | 'thigh' | 'arm' | 'glute';
};

export const INJECTION_SITES: InjectionSite[] = [
  // Abdomen (most common for subcutaneous)
  { id: 'abd-upper-left', label: 'Upper Left Abdomen', labelMs: 'Abdomen Atas Kiri', x: 42, y: 42, side: 'left', region: 'abdomen' },
  { id: 'abd-upper-right', label: 'Upper Right Abdomen', labelMs: 'Abdomen Atas Kanan', x: 58, y: 42, side: 'right', region: 'abdomen' },
  { id: 'abd-lower-left', label: 'Lower Left Abdomen', labelMs: 'Abdomen Bawah Kiri', x: 42, y: 50, side: 'left', region: 'abdomen' },
  { id: 'abd-lower-right', label: 'Lower Right Abdomen', labelMs: 'Abdomen Bawah Kanan', x: 58, y: 50, side: 'right', region: 'abdomen' },

  // Thighs
  { id: 'thigh-upper-left', label: 'Left Upper Thigh', labelMs: 'Paha Atas Kiri', x: 40, y: 65, side: 'left', region: 'thigh' },
  { id: 'thigh-upper-right', label: 'Right Upper Thigh', labelMs: 'Paha Atas Kanan', x: 60, y: 65, side: 'right', region: 'thigh' },
  { id: 'thigh-mid-left', label: 'Left Mid Thigh', labelMs: 'Paha Tengah Kiri', x: 38, y: 72, side: 'left', region: 'thigh' },
  { id: 'thigh-mid-right', label: 'Right Mid Thigh', labelMs: 'Paha Tengah Kanan', x: 62, y: 72, side: 'right', region: 'thigh' },

  // Upper arms (deltoid area)
  { id: 'arm-left', label: 'Left Upper Arm', labelMs: 'Lengan Atas Kiri', x: 22, y: 32, side: 'left', region: 'arm' },
  { id: 'arm-right', label: 'Right Upper Arm', labelMs: 'Lengan Atas Kanan', x: 78, y: 32, side: 'right', region: 'arm' },

  // Glutes (rear view conceptually mapped)
  { id: 'glute-left', label: 'Left Glute', labelMs: 'Punggung Kiri', x: 42, y: 58, side: 'left', region: 'glute' },
  { id: 'glute-right', label: 'Right Glute', labelMs: 'Punggung Kanan', x: 58, y: 58, side: 'right', region: 'glute' },
];

export function getSiteById(id: string): InjectionSite | undefined {
  return INJECTION_SITES.find((s) => s.id === id);
}

export function getSiteLabel(id: string, locale: string): string {
  const site = getSiteById(id);
  if (!site) return id;
  return locale === 'ms' ? site.labelMs : site.label;
}
