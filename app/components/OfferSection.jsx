"use client";

import { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const slides = [
    { image: "/assets/images/OfferBanner1.png" },
    { image: "/assets/images/OfferBanner2.png" },
];

export default function OfferSection() {
    const [current, setCurrent] = useState(0);

    const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

    useEffect(() => {
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, []);

    const { image } = slides[current];

    return (
        <section className="relative max-w-7xl mx-auto h-auto px-3 sm:h-full rounded-0 md:rounded-lg flex items-center justify-center overflow-hidden">
            
            {/* 🔥 FULL WIDTH BACKGROUND FIX */}
            <div className="w-full">
                <img
                    src={image}
                    alt="Offer Banner"
                    className="w-full h-auto block object-cover"
                    draggable={false}
                />
            </div>

            {/* LEFT ARROW */}
            <button
                onClick={prevSlide}
                className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 
                bg-white/60 hover:bg-white text-black p-3 rounded-full shadow-lg transition 
                z-20 hidden md:flex"
            >
                <FiChevronLeft className="text-3xl" />
            </button>

            {/* RIGHT ARROW */}
            <button
                onClick={nextSlide}
                className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 
                bg-white/60 hover:bg-white text-black p-3 rounded-full shadow-lg transition 
                z-20 hidden md:flex"
            >
                <FiChevronRight className="text-3xl" />
            </button>
        </section>
    );
}
