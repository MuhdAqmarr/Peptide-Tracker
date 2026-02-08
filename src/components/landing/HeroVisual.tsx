'use client';

export function HeroVisual() {
  return (
    <div className="relative flex h-full min-h-[300px] w-full items-center justify-center overflow-hidden rounded-2xl sm:min-h-[400px]">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden="true"
      >
        <source src="/dnavideo.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
