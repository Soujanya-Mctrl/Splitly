'use client';

export function MovingGradientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="reactbits-gradient reactbits-gradient--one" />
      <div className="reactbits-gradient reactbits-gradient--two" />
      <div className="reactbits-gradient reactbits-gradient--three" />
      <div className="reactbits-noise" />
    </div>
  );
}
