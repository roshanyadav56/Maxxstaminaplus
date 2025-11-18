"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { SiYoutubeshorts } from "react-icons/si";

// ⭐ FIXED YOUTUBE ID EXTRACTOR — Supports ALL formats
function extractYouTubeID(url) {
  const regex = /(?:shorts\/|watch\?v=|embed\/|youtu\.be\/)([^&?]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// ⭐ Fetch YouTube metadata using oEmbed
async function fetchYouTubeMeta(url) {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=${url}&format=json`
    );
    if (!res.ok) return null;
    return await res.json(); // returns: title, author_name, thumbnail_url
  } catch (err) {
    console.error("YouTube Meta Error:", err);
    return null;
  }
}

export default function TestimonialSlider() {
  const [activeVideo, setActiveVideo] = useState(null);
  const [reviews, setReviews] = useState([
    { id: 1, url: "https://youtube.com/shorts/FqQNgZgI3XI?si=DIadtbbStw0nfnTz" },
    { id: 2, url: "https://www.youtube.com/shorts/JtCFv2vKY00?feature=share" },
    { id: 3, url: "https://www.youtube.com/shorts/-uKCEZsi5xM?feature=share" },
    { id: 4, url: "https://www.youtube.com/shorts/JQIoTPQnx40?feature=share" },
    { id: 5, url: "https://www.youtube.com/shorts/aGAlZq63GIM?feature=share" },
  ]);

  // ⭐ Load title & channel automatically
  useEffect(() => {
    async function loadMeta() {
      const updated = await Promise.all(
        reviews.map(async (item) => {
          const data = await fetchYouTubeMeta(item.url);
          return {
            ...item,
            title: data?.title || "No Title",
            channel: data?.author_name || "Unknown Channel",
            thumbnail: data?.thumbnail_url, // optional
          };
        })
      );
      setReviews(updated);
    }
    loadMeta();
  }, []);

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-2xl shadow-sm p-8 md:p-10 relative overflow-hidden bg-[var(--light-color)]">
          <h2 className="text-3xl font-bold text-[var(--primary-color)] mb-8">
            OUR HAPPY CUSTOMERS
          </h2>

          <Swiper
            modules={[Autoplay]}
            spaceBetween={22}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop
            breakpoints={{
              0: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }}
          >
            {reviews.map((item) => {
              const videoID = extractYouTubeID(item.url);

              return (
                <SwiperSlide key={item.id}>
                  <div className="block relative rounded-2xl overflow-hidden shadow-lg border border-[var(--bg-muted)]">
                    {/* Thumbnail */}
                    <img
                      src={item.thumbnail || `https://img.youtube.com/vi/${videoID}/hqdefault.jpg`}
                      className="w-full h-[500px] object-cover"
                      alt={item.title}
                    />

                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-transparent"></div>

                    <div className="absolute top-3 left-3">
                      <h3 className="text-lg font-semibold text-[var(--light-color)]">
                        {item.title}
                      </h3>
                      <p className="text-sm opacity-90 text-[var(--light-color)]">
                        {item.channel}
                      </p>
                    </div>

                    {/* Play Button */}
                    <button
                      onClick={() => setActiveVideo(item.url)}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="w-32 h-32 rounded-full flex items-center justify-center">
                        <SiYoutubeshorts
                          size={70}
                          className="text-[var(--primary-color)] drop-shadow-[0_0_10px_var(--light-color)] cursor-pointer"
                        />
                      </div>
                    </button>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Popup Player */}
          {activeVideo && (
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999]"
              onClick={() => setActiveVideo(null)}
            >
              <div className="w-full max-w-3xl bg-black rounded-xl overflow-hidden shadow-2xl">
                <iframe
                  width="100%"
                  height="500"
                  src={`https://www.youtube.com/embed/${extractYouTubeID(activeVideo)}?autoplay=1`}
                  allow="autoplay; encrypted-media"
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}






































// "use client";

// import { useEffect, useRef, useState } from "react";
// import Image from "next/image";
// import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
// import { AiFillStar } from "react-icons/ai";
// import { BsCheckCircleFill } from "react-icons/bs";

// const TESTIMONIALS = [
//   {
//     id: 1,
//     name: "Sarah M.",
//     avatar: "/assets/Images/testmonial.png",
//     rating: 5,
//     text:
//       "I'm blown away by the quality and style of the products I received. Every piece has exceeded my expectations.",
//   },
//   {
//     id: 2,
//     name: "John D.",
//     avatar: "/assets/Images/testmonial.png",
//     rating: 5,
//     text:
//       "Fantastic experience — fast delivery and excellent results. Highly recommend MaxxStaminaPlus!",
//   },
//   {
//     id: 3,
//     name: "Emma R.",
//     avatar: "/assets/Images/testmonial.png",
//     rating: 5,
//     text:
//       "Top-tier products and service. I will definitely buy again and suggest to friends.",
//   },
//   {
//     id: 4,
//     name: "Mark P.",
//     avatar: "/assets/Images/testmonial.png",
//     rating: 5,
//     text:
//       "Great packaging and the product worked exactly as described. Very happy customer!",
//   },
// ];

// export default function TestimonialSlider({
//   items = TESTIMONIALS,
//   autoplay = true,
//   autoplayDelay = 5000,
// }) {
//   const [index, setIndex] = useState(0);
//   const [perView, setPerView] = useState(4);
//   const autoplayRef = useRef(null);
//   const touchStartX = useRef(null);

//   // Responsive perView
//   useEffect(() => {
//     function calcPerView() {
//       const w = window.innerWidth;
//       if (w < 640) setPerView(1); // Mobile
//       else if (w < 1024) setPerView(2); // Tablet
//       else setPerView(4); // Desktop
//     }
//     calcPerView();
//     window.addEventListener("resize", calcPerView);
//     return () => window.removeEventListener("resize", calcPerView);
//   }, []);

//   const maxIndex = Math.max(0, items.length - perView);

//   useEffect(() => {
//     if (index > maxIndex) setIndex(maxIndex);
//   }, [perView, maxIndex, index]);

//   // Autoplay
//   useEffect(() => {
//     if (!autoplay) return;
//     clearInterval(autoplayRef.current);
//     autoplayRef.current = setInterval(() => {
//       setIndex((i) => (i >= maxIndex ? 0 : i + 1));
//     }, autoplayDelay);
//     return () => clearInterval(autoplayRef.current);
//   }, [autoplay, autoplayDelay, maxIndex]);

//   // Keyboard navigation
//   useEffect(() => {
//     function onKey(e) {
//       if (e.key === "ArrowLeft") prev();
//       if (e.key === "ArrowRight") next();
//     }
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, []);

//   // Swipe logic
//   function onTouchStart(e) {
//     touchStartX.current = e.touches[0].clientX;
//   }
//   function onTouchEnd(e) {
//     if (touchStartX.current === null) return;
//     const diff = touchStartX.current - e.changedTouches[0].clientX;
//     const threshold = 50;
//     if (diff > threshold) next();
//     else if (diff < -threshold) prev();
//     touchStartX.current = null;
//   }

//   function resetAutoplay() {
//     if (!autoplay) return;
//     clearInterval(autoplayRef.current);
//     autoplayRef.current = setInterval(() => {
//       setIndex((i) => (i >= maxIndex ? 0 : i + 1));
//     }, autoplayDelay);
//   }

//   function prev() {
//     setIndex((i) => (i <= 0 ? maxIndex : i - 1));
//     resetAutoplay();
//   }
//   function next() {
//     setIndex((i) => (i >= maxIndex ? 0 : i + 1));
//     resetAutoplay();
//   }

//   // Layout
//   const cardWidthPercent = 100 / perView;
//   const trackWidthPercent = items.length * cardWidthPercent;
//   const translatePercent = index * cardWidthPercent;

//   const trackStyle = {
//     width: `${trackWidthPercent}%`,
//     transform: `translateX(-${translatePercent}%)`,
//     transition: "transform 400ms ease",
//   };

//   const dotsCount = maxIndex + 1;

//   return (
//     <>
//       {/* Header */}
//       <div className="flex items-center justify-between mb-8">
//         <h3 className="text-3xl font-extrabold text-[var(--primary-color)]">
//           OUR HAPPY CUSTOMERS
//         </h3>
//         <div className="flex gap-2">
//           <button
//             onClick={prev}
//             className="p-2 rounded-md hover:bg-[var(--bg-muted)]"
//             aria-label="Previous"
//           >
//             <FiChevronLeft className="text-[var(--primary-color)]" size={20} />
//           </button>
//           <button
//             onClick={next}
//             className="p-2 rounded-md hover:bg-[var(--bg-muted)]"
//             aria-label="Next"
//           >
//             <FiChevronRight className="text-[var(--primary-color)]" size={20} />
//           </button>
//         </div>
//       </div>

//       {/* Viewport */}
//       <div
//         className="relative overflow-hidden w-full"
//         onTouchStart={onTouchStart}
//         onTouchEnd={onTouchEnd}
//       >
//         <div className="flex will-change-transform" style={trackStyle}>
//           {items.map((it) => (
//             <article
//               key={it.id}
//               className="bg-[var(--light-color)] border border-[var(--bg-muted)] rounded-lg shadow-md flex flex-col mx-2 sm:mx-4 overflow-hidden"
//               style={{
//                 width: `${cardWidthPercent}%`,
//                 minWidth: `${cardWidthPercent}%`,
//               }}
//             >
//               {/* ✅ Fixed Image Section */}
//               <div className="relative w-full bg-[var(--bg-muted)]">
//                 <Image
//                   src={it.avatar}
//                   alt={it.name}
//                   width={600}
//                   height={400}
//                   className="w-full md:h-auto h-72 object-cover md:object-contain object-center"
//                   sizes="100vw"
//                   priority
//                 />
//               </div>

//               {/* ✅ Text Section */}
//               <div className="flex flex-col justify-between flex-grow p-4">
//                 <div>
//                   <div className="flex items-center justify-between mb-3">
//                     <div className="flex items-center gap-3">
//                       <div className="font-semibold text-[var(--dark-color)]">
//                         {it.name}
//                       </div>
//                       <div className="text-[10px] flex items-center gap-1">
//                         <BsCheckCircleFill className="text-[var(--primary-color)]" size={12} />
//                         <span className="sr-only">Verified</span>
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-1 text-[var(--primary-color)]">
//                       {Array.from({ length: it.rating }).map((_, i) => (
//                         <AiFillStar key={i} size={14} />
//                       ))}
//                     </div>
//                   </div>

//                   <p className="text-sm text-[var(--text-muted)] leading-relaxed">
//                     “{it.text}”
//                   </p>
//                 </div>
//               </div>
//             </article>
//           ))}
//         </div>
//       </div>

//       {/* Dots */}
//       <div className="mt-6 flex justify-center gap-2">
//         {Array.from({ length: dotsCount }).map((_, i) => (
//           <button
//             key={i}
//             onClick={() => {
//               setIndex(i);
//               resetAutoplay();
//             }}
//             className={`w-2 h-2 rounded-full ${
//               i === index ? "bg-[var(--primary-color)]" : "bg-[var(--bg-muted)]"
//             }`}
//           />
//         ))}
//       </div>
//     </>
//   );
// }
