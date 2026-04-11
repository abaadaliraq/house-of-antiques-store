"use client";

import type { ReactNode } from "react";

type StoreShellProps = {
  hero?: ReactNode;
  topbar?: ReactNode;
  filters?: ReactNode;
  categories?: ReactNode;
  featured?: ReactNode;
  stickyShowcase?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
};

export default function StoreShell({
  hero,
  topbar,
  filters,
  categories,
  featured,
  stickyShowcase,
  footer,
  children,
}: StoreShellProps) {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#050505] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_30%),radial-gradient(circle_at_bottom,rgba(255,255,255,0.03),transparent_28%)]" />

      {topbar}

      <main className="relative z-10">
        {hero}

        <section className="relative -mt-3 rounded-t-[2rem] border-t border-white/10 bg-[#0b0d10] text-white shadow-[0_-24px_80px_rgba(0,0,0,0.55)] sm:-mt-6 sm:rounded-t-[2.5rem]">
          <div className="mx-auto flex w-full max-w-[160px]7xl flex-col gap-6 px-4 pb-12 pt-5 sm:px-6 sm:pb-16 sm:pt-7 lg:px-8 lg:pb-20">
            {filters}
            {categories}
            {featured}
            {children}
          </div>
        </section>

        {stickyShowcase}
      </main>

      {footer}

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        .store-fade-up {
          opacity: 0;
          transform: translateY(18px);
          animation: storeFadeUp 0.75s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .store-fade-up-delay-1 {
          animation-delay: 0.08s;
        }

        .store-fade-up-delay-2 {
          animation-delay: 0.16s;
        }

        .store-fade-up-delay-3 {
          animation-delay: 0.24s;
        }

        .store-fade-up-delay-4 {
          animation-delay: 0.32s;
        }

        .store-fade-line {
          position: relative;
          display: block;
          overflow: hidden;
        }

        .store-fade-line > span {
          display: inline-block;
          opacity: 0;
          transform: translateY(20px);
          animation: storeFadeUp 0.85s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .store-fade-line.delay-1 > span {
          animation-delay: 0.08s;
        }

        .store-fade-line.delay-2 > span {
          animation-delay: 0.16s;
        }

        .store-fade-line.delay-3 > span {
          animation-delay: 0.24s;
        }

        .store-fade-line.mask-right::after {
          content: "";
          position: absolute;
          inset: 0 0 0 auto;
          width: 22%;
          background: linear-gradient(to right, transparent, #f6f4ef 72%);
          pointer-events: none;
        }

        .store-fade-line.mask-left::after {
          content: "";
          position: absolute;
          inset: 0 auto 0 0;
          width: 22%;
          background: linear-gradient(to left, transparent, #f6f4ef 72%);
          pointer-events: none;
        }

        .store-section-title {
          letter-spacing: -0.03em;
        }

        .store-soft-card {
          border: 1px solid rgba(33, 10, 10, 0.08);
          background: rgba(255, 255, 255, 0.78);
          backdrop-filter: blur(18px);
          box-shadow:
            0 10px 30px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.55);
        }

        .store-hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .store-hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        @keyframes storeFadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}