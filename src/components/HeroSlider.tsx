"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export type SlideData = {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  linkUrl: string | null;
};

export default function HeroSlider({ slides }: { slides: SlideData[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  if (slides.length === 0) return null;

  return (
    <div className="relative h-[360px] w-full overflow-hidden sm:h-[440px] md:h-[520px]">
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            i === index ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          style={{
            backgroundImage: `url(${slide.imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-6 sm:px-10">
            <div key={i === index ? "active" : "inactive"} className="max-w-xl animate-fade-slide">
              <h2 className="text-2xl font-extrabold leading-tight text-white drop-shadow-sm sm:text-3xl md:text-4xl">
                {slide.title}
              </h2>
              {slide.subtitle && (
                <p className="mt-3 text-sm text-white/90 sm:text-base">{slide.subtitle}</p>
              )}
              <Link
                href={slide.linkUrl ?? "/products"}
                className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-dark"
              >
                ดูสินค้าของเรา
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      ))}

      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              aria-label={`ไปที่สไลด์ ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-6 bg-white" : "w-2 bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
