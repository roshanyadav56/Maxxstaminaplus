"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import Link from "next/link";

export default function WatchAndShopSlider() {
  const products = [
    {
      id: 1,
      name: "SHILAJIT GOLD (15ml Pack)",
      image: "/assets/images/ShilajitGold.png",
      currentPrice: "₹459.00",
      oldPrice: "₹699.00",
      save: "₹240",
      video: "/assets/video/ProductVideo1.mp4",
    },
    {
      id: 2,
      name: "SHILAJIT GOLD RESIN",
      image: "/assets/images/ShilajitGoldResin.png",
      currentPrice: "₹459.00",
      oldPrice: "₹699.00",
      save: "₹240",
      video: "/assets/video/ProductVideo2.mp4",
    },
    {
      id: 3,
      name: "Extra Shot + (40 CAPSULES)",
      image: "/assets/images/ExtraShot.png",
      currentPrice: "₹499.00",
      oldPrice: "₹699.00",
      save: "₹200",
      video: "/assets/video/ProductVideo1.mp4",
    },
    {
      id: 4,
      name: "SEXUAL WELLNESS SUPPLEMENT (60 CAPSULES)",
      image: "/assets/images/SexualWellness.png",
      currentPrice: "₹499.00",
      oldPrice: "₹699.00",
      save: "₹200",
      video: "/assets/video/ProductVideo2.mp4",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-14">
      <h2 className="text-center text-3xl font-bold text-[var(--primary-color)] mb-8">
        WATCH AND SHOP
      </h2>

      <Swiper
        modules={[Autoplay]}
        spaceBetween={22}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={true}
        breakpoints={{
          0: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
      >
        {products.map((item) => (
          <SwiperSlide key={item.id}>

            {/* FULL CARD CLICKABLE */}
            <Link href={`/products/${item.id}`} className="block relative">

              <div className="rounded-xl overflow-hidden shadow-lg bg-[var(--light-color)]">
                <div className="w-full bg-[var(--light-color)] relative">

                  <video autoPlay loop muted className="w-full h-[500px] object-cover">
                    <source src={item.video} type="video/mp4" />
                  </video>

                  <div className="m-4 absolute bottom-0 bg-white/90 backdrop-blur-sm p-3 rounded-lg w-[90%] flex items-center gap-3 pointer-events-none">

                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-16 object-contain"
                    />

                    <div>
                      <h3 className="font-semibold text-[var(--dark-color)] text-sm line-clamp-1">
                        {item.name}
                      </h3>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold text-[var(--primary-color)]">
                          {item.currentPrice}
                        </span>
                        <span className="line-through text-[var(--text-muted)] text-sm">
                          {item.oldPrice}
                        </span>
                      </div>

                      <p className="text-[var(--accent-color)] text-sm font-semibold">
                        Save – {item.save}
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </Link>

          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
