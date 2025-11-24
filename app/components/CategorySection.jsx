"use client";
import { useState, useEffect, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const CategorySlider = () => {
  const categories = [
    { name: "Best Sellers", image: "/assets/Images/testmonial.png" },
    { name: "Shilajit", image: "/assets/Images/testmonial.png" },
    { name: "Shilajit", image: "/assets/Images/testmonial.png" },
    { name: "Asavganda", image: "/assets/Images/testmonial.png" },
    { name: "Capsule", image: "/assets/Images/testmonial.png" },
    { name: "All Products", image: "/assets/Images/testmonial.png" },
    { name: "Combo Pack", image: "/assets/Images/testmonial.png" },
    { name: "Ayurvedic", image: "/assets/Images/testmonial.png" },
  ];

  const [itemsPerView, setItemsPerView] = useState(4);
  const trackRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;

      if (w < 640) setItemsPerView(4);      // MOBILE = 4 items only
      else if (w < 900) setItemsPerView(5); // Tablet
      else setItemsPerView(6);              // Desktop
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scroll = (dir) => {
    const track = trackRef.current;
    if (!track) return;

    const amount = track.clientWidth * 0.9;
    track.scrollTo({
      left: dir === "next" ? track.scrollLeft + amount : track.scrollLeft - amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full py-2 sm:py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">

        {/* LEFT ARROW — hide on mobile */}
        <button
          onClick={() => scroll("prev")}
          className="hidden md:flex items-center justify-center border border-[var(--primary-color)] text-[var(--primary-color)] rounded-full p-2 mr-3"
        >
          <FaChevronLeft size={16} />
        </button>

        {/* SLIDER */}
        <div
          ref={trackRef}
          className="overflow-x-auto no-scrollbar w-full mx-2 sm:mx-4"
          style={{
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch",
            scrollSnapType: "x mandatory",
          }}
        >
          <div className="flex gap-2">
            {categories.map((item, i) => (
              <div
                key={i}
                className="category-item flex-shrink-0 flex flex-col items-center text-center"
                style={{
                  width: `${100 / itemsPerView}%`,
                  scrollSnapAlign: "start",
                }}
              >
                <img
                  src={item.image}
                  className="w-10 h-10 sm:w-24 sm:h-24 rounded sm:rounded-2xl object-cover"
                />
                <p className="text-[var(--primary-color)] font-medium mt-2 text-xs sm:text-sm">
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT ARROW — hide on mobile */}
        <button
          onClick={() => scroll("next")}
          className="hidden md:flex items-center justify-center border border-[var(--primary-color)] text-[var(--primary-color)] rounded-full p-2 ml-3"
        >
          <FaChevronRight size={16} />
        </button>

      </div>
    </div>
  );
};

export default CategorySlider;
