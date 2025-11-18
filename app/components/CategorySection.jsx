"use client";
import { useState, useEffect } from "react";
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

  const [index, setIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(6);

  // Responsive itemsPerView
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setItemsPerView(w < 640 ? 2 : 6);
      setIndex(0);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    if (index < categories.length - itemsPerView) {
      setIndex(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (index > 0) {
      setIndex(prev => prev - 1);
    }
  };

  return (
    <div className="w-full py-6">
      <div className="max-w-6xl mx-auto px-8 sm:px-4 lg:px-6 flex items-center justify-center">

        {/* LEFT ARROW */}
        <button
          onClick={prevSlide}
          className="border border-[var(--primary-color)] text-[var(--primary-color)] rounded-full p-2 w-8 h-8 flex items-center justify-center"
        >
          <FaChevronLeft size={18} />
        </button>

        {/* SLIDER */}
        <div className="overflow-hidden w-full mx-2 sm:mx-4">
          <div
            className="flex transition-all duration-300"
            style={{ transform: `translateX(-${index * (100 / itemsPerView)}%)` }}
          >
            {categories.map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center"
                style={{ flex: `0 0 ${100 / itemsPerView}%` }}
              >
                <img
                  src={item.image}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover"
                  alt={item.name}
                />
                <p className="text-[var(--primary-color)] font-base mt-2 text-sm sm:text-base">{item.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT ARROW */}
        <button
          onClick={nextSlide}
          className="border border-[var(--primary-color)] text-[var(--primary-color)] rounded-full p-2 w-8 h-8 flex items-center justify-center"
        >
          <FaChevronRight size={18} />
        </button>

      </div>
    </div>
  );
};

export default CategorySlider;
