

"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const images = [
  "/heroimage/hero1.webp",
  "/heroimage/hero2.webp",
  "/heroimage/hero3.webp",
  "/heroimage/hero4.webp",
  "/heroimage/hero5.webp",
];

const Hero = () => {
  return (
    <section className="overflow-hidden bg-[#FAF8F3]">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8">

        {/* Hero Content */}
        <div className="max-w-xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E8A85C]/40 bg-[#E8A85C]/10 px-4 py-2 text-sm font-medium text-[#173F35]">
            <Sparkles size={16} />
            <span>Your Little Corner of Books</span>
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight text-[#173F35] sm:text-5xl lg:text-6xl">
            Discover Stories.
            <br />
            <span className="text-[#E8A85C]">
              Explore New Worlds.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-8 text-[#727C75] sm:text-lg">
            Every book holds a new adventure. Explore our growing
            collection, discover your next favorite read, and
            share the joy of books with everyone.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/books"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#173F35] px-7 py-3.5 font-semibold text-white transition-all duration-300 hover:bg-[#102F28] hover:shadow-lg"
            >
              Explore Books
              <ArrowRight size={19} />
            </Link>

            <Link
              href="/books/add"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#173F35] px-7 py-3.5 font-semibold text-[#173F35] transition-all duration-300 hover:bg-[#173F35] hover:text-white"
            >
              <BookOpen size={19} />
              Add a Book
            </Link>
          </div>

          {/* Small Highlight */}
          <div className="mt-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E8A85C]/20 text-[#173F35]">
              <BookOpen size={22} />
            </div>

            <div>
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
        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
          {/* Decorative Background */}
          <div className="absolute -right-5 -top-5 h-32 w-32 rounded-full bg-[#E8A85C]/20 blur-2xl sm:-right-8 sm:-top-8" />
          <div className="absolute -bottom-5 -left-5 h-40 w-40 rounded-full bg-[#173F35]/10 blur-2xl" />

          <div className="relative overflow-hidden rounded-3xl border border-[#E7E5DF] bg-white p-2 shadow-xl sm:p-3">
            <Swiper
              modules={[Autoplay, Pagination, EffectFade]}
              effect="fade"
              loop
              autoplay={{
                delay: 3500,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
              }}
              className="hero-swiper overflow-hidden rounded-2xl"
            >
              {images.map((image, index) => (
                <SwiperSlide key={image}>
                  <div className="relative aspect-[4/4.2] w-full overflow-hidden rounded-2xl">
                    <Image
                      src={image}
                      alt={`BookNook featured image ${index + 1}`}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 1024px) 90vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Floating Label */}
          <div className="absolute -bottom-5 left-4 z-10 rounded-xl border border-[#E7E5DF] bg-white px-4 py-3 shadow-lg sm:-left-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#173F35] text-white">
                <BookOpen size={21} />
              </div>
              <div>
                <p className="text-sm font-bold text-[#173F35]">
                  Find Your Next Read
                </p>
                <p className="text-xs text-[#727C75]">
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
