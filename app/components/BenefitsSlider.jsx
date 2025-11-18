"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function BenefitsSlider() {
  const benefits = [
    "/assets/images/benefit.png",
    "/assets/images/benefit.png",
    "/assets/images/benefit.png",
    "/assets/images/benefit.png",
    "/assets/images/benefit.png",
  ];

  return (
    <section className="mt-14">
      <h2 className="text-center text-2xl md:text-3xl font-bold text-[var(--dark-color)] mb-6">
        5 BENEFITS OF SEXUAL WELLNESS SUPPLEMENT
      </h2>

      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={20}
        slidesPerView={1.2}
        loop
        autoplay={{ delay: 3000 }}
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 2.2 },
          1024: { slidesPerView: 3.2 },
        }}
        className="pb-10"
      >
        {benefits.map((img, i) => (
          <SwiperSlide key={i}>
            <div className="rounded-xl overflow-hidden shadow bg-[var(--light-color)]">
              <div className="relative w-full aspect-square">
                <Image
                  src={img}
                  alt="Benefit"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
