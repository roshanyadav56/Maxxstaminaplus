"use client";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Swiper CSS
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// ⭐ Autoplay Module import
import { Autoplay } from "swiper/modules";

const AdSection = () => {
  const categories = [
    { image: "/assets/Images/Ads1.png" },
    { image: "/assets/Images/Ads2.png" },
    { image: "/assets/Images/Ads3.png" },
  ];

  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setItemsPerView(w < 640 ? 1 : 3);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full py-6">
      <div className="max-w-7xl mx-3 md:mx-auto flex items-center justify-center py-4  bg-[var(--light-color)] rounded-xl shadow-sm relative">

        {/* Mobile Swiper */}
        <div className="block lg:hidden w-full mx-4">
          <Swiper
            modules={[Autoplay]}   // ⭐ REQUIRED FOR AUTOSLIDE
            spaceBetween={10}
            slidesPerView={1}
            autoplay={{
              delay: 2000,          // ⭐ Auto-slide delay
              disableOnInteraction: false,
            }}
            loop={true}
          >
            {categories.map((item, i) => (
              <SwiperSlide key={i}>
                <div className="flex justify-center items-center mx-3">
                  <img
                    src={item.image}
                    className="w-full h-full rounded-2xl object-cover"
                    alt={`Ad ${i}`}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Desktop Static View */}
        <div className="hidden lg:block w-full mx-4">
          <div className="flex justify-between gap-6">
            {categories.map((item, i) => (
              <div key={i} className="flex justify-center items-center">
                <img
                  src={item.image}
                  className="w-full h-full rounded-2xl object-cover"
                  alt={`Ad ${i}`}
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdSection;
