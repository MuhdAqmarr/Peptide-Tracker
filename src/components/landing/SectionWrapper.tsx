'use client';

type SectionWrapperProps = {
  id: string;
  children: React.ReactNode;
  className?: string;
};

export function SectionWrapper({ id, children, className = '' }: SectionWrapperProps) {
  return (
    <section id={id} className={`scroll-mt-20 px-6 py-16 sm:px-10 sm:py-20 ${className}`}>
      {children}
    </section>
  );
}
