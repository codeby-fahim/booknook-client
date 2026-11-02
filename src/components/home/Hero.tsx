
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, EffectFade } from "swiper/modules";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const images = [
  "/heroImage/hero1.webp",
  "/heroImage/hero2.webp",
  "/heroImage/hero3.webp",
  "/heroImage/hero4.webp",
  "/heroImage/hero5.webp",
];

const Hero = () => {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  useEffect(() => {
    if (!swiper) return;

    const timer = window.setInterval(() => {
      if (!swiper.destroyed) {
        swiper.slideNext();
      }
    }, 3500);

    return () => window.clearInterval(timer);
  }, [swiper]);

  return (
    <section className="overflow-hidden bg-[#FAF8F3]">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-20">

        {/* Hero Content */}
        <div className="min-w-0 w-full max-w-xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#E8A85C]/40 bg-[#E8A85C]/10 px-3 py-2 text-xs font-medium text-[#173F35] sm:text-sm">
            <Sparkles size={16} />
            <span>Your Little Corner of Books</span>
          </div>

          <h1 className="text-4xl font-bold leading-[1.15] tracking-tight text-[#173F35] sm:text-5xl lg:text-6xl">
            Discover Stories.
            <br />
            <span className="text-[#E8A85C]">
              Explore New Worlds.
            </span>
          </h1>

          <p className="mt-5 max-w-lg text-sm leading-7 text-[#727C75] sm:mt-6 sm:text-base sm:leading-8 lg:text-lg">
            Every book holds a new adventure. Explore our growing
            collection, discover your next favorite read, and
            share the joy of books with everyone.
          </p>

          {/* CTA Buttons */}
          <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
            <Link
              href="/books"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#173F35] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#102F28] hover:shadow-lg sm:w-auto sm:px-7"
            >
              Explore Books
              <ArrowRight size={19} />
            </Link>

            <Link
              href="/books/add"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#173F35] px-6 py-3.5 text-sm font-semibold text-[#173F35] transition-all duration-300 hover:bg-[#173F35] hover:text-white sm:w-auto sm:px-7"
            >
              <BookOpen size={19} />
              Add a Book
            </Link>
          </div>

          {/* Small Highlight */}
          <div className="mt-8 flex items-center gap-3 sm:mt-10">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E8A85C]/20 text-[#173F35]">
              <BookOpen size={22} />
            </div>

            <div className="min-w-0">
              <p className="font-semibold text-[#252D29]">
                Read. Borrow. Share.
              </p>
              <p className="text-sm text-[#727C75]">
                A simple way to enjoy more books.
              </p>
            </div>
          </div>
        </div>

        {/* Hero Image Slider */}
        <div className="relative mx-auto w-full min-w-0 max-w-lg lg:max-w-none">

          {/* Decorative Background */}
          <div className="absolute -right-5 -top-5 h-28 w-28 rounded-full bg-[#E8A85C]/20 blur-2xl sm:h-32 sm:w-32" />

          <div className="absolute -bottom-5 -left-5 h-32 w-32 rounded-full bg-[#173F35]/10 blur-2xl sm:h-40 sm:w-40" />

          {/* Slider Container */}
          <div className="relative w-full rounded-2xl border border-[#E7E5DF] bg-white p-2 shadow-xl sm:rounded-3xl sm:p-3">

            <Swiper
              modules={[Pagination, EffectFade]}
              effect="fade"
              loop
              onSwiper={setSwiper}
              pagination={{ clickable: true }}
              className="hero-swiper w-full overflow-hidden rounded-xl sm:rounded-2xl"
            >
              {images.map((image, index) => (
                <SwiperSlide key={image}>
                  <div className="relative aspect-5/4 w-full overflow-hidden rounded-xl sm:aspect-4/3 lg:aspect-[4/4.2]">
                    <Image
                      src={image}
                      alt={`BookNook featured image ${index + 1}`}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Floating Label */}
          <div className="absolute -bottom-5 left-3 z-10 max-w-[calc(100%-24px)] rounded-xl border border-[#E7E5DF] bg-white px-3 py-3 shadow-lg sm:-left-5 sm:px-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#173F35] text-white sm:h-10 sm:w-10">
                <BookOpen size={21} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold text-[#173F35] sm:text-sm">
                  Find Your Next Read
                </p>
                <p className="text-[11px] text-[#727C75] sm:text-xs">
                  Explore endless possibilities
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;

