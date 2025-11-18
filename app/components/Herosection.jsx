"use client";

import { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const slides = [
    {
        image: "/assets/images/hero.png",
    },
    {
        image: "/assets/images/hero.png",
    },
    // आप यहाँ और slides add कर सकते हैं
];

export default function HeroSlider() {
    const [current, setCurrent] = useState(0);

    const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

    // Optional: Auto slide every 5 sec
    useEffect(() => {
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, []);

    const { title, subtitle, image, buttonText } = slides[current];

    return (
        <section className="relative max-w-7xl mx-auto h-full flex items-center justify-center overflow-hidden">

            {/* Center Product Image */}
            <div className="relative z-10 flex justify-center">
                <img
                    src={image}
                    alt="Product"
                    className="w-full drop-shadow-2xl"
                    draggable={false}
                />
            </div>

            {/* Left Arrow */}
            <button
                onClick={prevSlide}
                aria-label="Previous Slide"
                className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 bg-white/60 hover:bg-white text-black p-3 rounded-full shadow-lg transition z-20 invisible md:visible"
            >
                <FiChevronLeft className="text-3xl" />
            </button>

            {/* Right Arrow */}
            <button
                onClick={nextSlide}
                aria-label="Next Slide"
                className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 bg-white/60 hover:bg-white text-black p-3 rounded-full shadow-lg transition z-20 invisible md:visible"
            >
                <FiChevronRight className="text-3xl" />
            </button>

            {/* Optional subtle background shapes */}
            <div className="pointer-events-none absolute inset-0 z-0"></div>
        </section>
    );
}
