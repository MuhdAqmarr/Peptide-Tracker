'use client';

/**
 * Animated bio/medical background with floating molecular particles.
 * Uses pure CSS animations on transform + opacity for GPU compositing.
 * Respects prefers-reduced-motion.
 */

const particles = [
  // Large slow blobs
  { size: 180, x: '8%', y: '12%', duration: 28, delay: 0, opacity: 0.3 },
  { size: 220, x: '85%', y: '8%', duration: 32, delay: -4, opacity: 0.25 },
  { size: 160, x: '75%', y: '55%', duration: 26, delay: -8, opacity: 0.3 },
  { size: 200, x: '15%', y: '70%', duration: 30, delay: -12, opacity: 0.25 },
  // Medium drifting circles
  { size: 80, x: '25%', y: '30%', duration: 20, delay: -2, opacity: 0.4 },
  { size: 60, x: '60%', y: '20%', duration: 18, delay: -6, opacity: 0.35 },
  { size: 90, x: '45%', y: '65%', duration: 22, delay: -10, opacity: 0.35 },
  { size: 70, x: '90%', y: '40%', duration: 19, delay: -3, opacity: 0.4 },
  { size: 50, x: '10%', y: '45%', duration: 16, delay: -7, opacity: 0.35 },
  // Small fast molecules
  { size: 24, x: '30%', y: '15%', duration: 14, delay: -1, opacity: 0.55 },
  { size: 18, x: '70%', y: '35%', duration: 12, delay: -5, opacity: 0.5 },
  { size: 20, x: '50%', y: '80%', duration: 13, delay: -9, opacity: 0.5 },
  { size: 16, x: '20%', y: '85%', duration: 11, delay: -3, opacity: 0.55 },
  { size: 22, x: '80%', y: '75%', duration: 15, delay: -7, opacity: 0.45 },
  // Tiny dots
  { size: 8, x: '40%', y: '10%', duration: 10, delay: -2, opacity: 0.65 },
  { size: 10, x: '55%', y: '45%', duration: 9, delay: -4, opacity: 0.6 },
  { size: 6, x: '35%', y: '55%', duration: 8, delay: -6, opacity: 0.7 },
  { size: 8, x: '65%', y: '90%', duration: 11, delay: -1, opacity: 0.6 },
];

// Helix connector lines (subtle DNA bridges)
const helixLines = [
  { x: '18%', y: '25%', rotation: 30, width: 60, duration: 24, delay: -2 },
  { x: '78%', y: '15%', rotation: -20, width: 50, duration: 22, delay: -8 },
  { x: '12%', y: '60%', rotation: 45, width: 40, duration: 20, delay: -5 },
  { x: '82%', y: '65%', rotation: -35, width: 55, duration: 26, delay: -11 },
  { x: '50%', y: '85%', rotation: 15, width: 45, duration: 18, delay: -3 },
];

export function BioBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden motion-reduce:hidden"
      aria-hidden="true"
    >
      {/* Particles */}
      {particles.map((p, i) => (
        <div
          key={`p-${i}`}
          className="absolute rounded-full will-change-transform"
          style={{
            width: p.size,
            height: p.size,
            left: p.x,
            top: p.y,
            opacity: p.opacity,
            background:
              p.size > 100
                ? 'radial-gradient(circle, rgba(59,130,246,0.5) 0%, rgba(99,102,241,0.3) 50%, transparent 70%)'
                : p.size > 40
                  ? 'radial-gradient(circle, rgba(59,130,246,0.6) 0%, rgba(147,197,253,0.3) 60%, transparent 80%)'
                  : 'radial-gradient(circle, rgba(96,165,250,0.8) 0%, rgba(59,130,246,0.4) 50%, transparent 80%)',
            animation: `bioFloat${i % 3} ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}

      {/* DNA helix bridge lines */}
      {helixLines.map((l, i) => (
        <div
          key={`l-${i}`}
          className="absolute will-change-transform"
          style={{
            left: l.x,
            top: l.y,
            width: l.width,
            height: 1.5,
            opacity: 0.3,
            background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.6), transparent)',
            transform: `rotate(${l.rotation}deg)`,
            animation: `bioLine ${l.duration}s ease-in-out ${l.delay}s infinite`,
          }}
        />
      ))}

      {/* Inline keyframes */}
      <style>{`
        @keyframes bioFloat0 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(12px, -18px) scale(1.05); }
          66% { transform: translate(-8px, 14px) scale(0.95); }
        }
        @keyframes bioFloat1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-15px, 10px) scale(0.96); }
          66% { transform: translate(10px, -12px) scale(1.04); }
        }
        @keyframes bioFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(8px, 16px) scale(1.03); }
          66% { transform: translate(-12px, -10px) scale(0.97); }
        }
        @keyframes bioLine {
          0%, 100% { opacity: 0.3; transform: rotate(var(--r, 0deg)) scaleX(1); }
          50% { opacity: 0.5; transform: rotate(var(--r, 0deg)) scaleX(1.2); }
        }
      `}</style>
    </div>
  );
}
