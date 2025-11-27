"use client";

import { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function HeroSlider() {

    const slides = [
        { video: "/assets/video/heroslider.mp4" },
        { image: "/assets/images/hero.png" },
    ];

    const [current, setCurrent] = useState(0);

    const hasSlider = slides.length > 1;

    const nextSlide = () => {
        setCurrent((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    };

    // ✅ Auto-slide (stable dependencies: NONE)
    useEffect(() => {
        if (!hasSlider) return;

        const interval = setInterval(nextSlide, 8000);
        return () => clearInterval(interval);

    }, []); // ✅ Size never changes

    // ✅ Reset to first slide when count changes (optional safety)
    useEffect(() => {
        setCurrent(0);
    }, [slides.length]);

    if (slides.length === 0) return null;

    const activeSlide = slides[current];

    return (
        <section className="relative max-w-7xl mx-auto h-48 sm:h-full rounded-0 md:rounded-lg flex items-center justify-center overflow-hidden">

            {activeSlide.video && (
                <video autoPlay loop muted className="w-full h-[500px] object-cover">
                    <source src={activeSlide.video} type="video/mp4" />
                </video>
            )}

            {activeSlide.image && (
                <img
                    src={activeSlide.image}
                    className="w-full h-[500px] object-cover"
                    alt="slide"
                />
            )}

            {hasSlider && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 bg-white/60 hover:bg-white text-black p-3 rounded-full shadow-lg transition z-20 invisible md:visible"
                    >
                        <FiChevronLeft className="text-3xl" />
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 bg-white/60 hover:bg-white text-black p-3 rounded-full shadow-lg transition z-20 invisible md:visible"
                    >
                        <FiChevronRight className="text-3xl" />
                    </button>
                </>
            )}
        </section>
    );
}
