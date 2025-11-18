// app/about/page.jsx
import Image from "next/image";
import TestimonialSlider from "../components/TestimonialSlider";

export default function AboutPage() {
  return (
    <>
      {/* Hero / Banner */}
      <section
        className="
          relative
          min-h-[60vh] md:min-h-[70vh] w-full flex items-center
          overflow-hidden
          before:content-[''] before:absolute before:inset-0 before:bg-[var(--dark-color)] before:opacity-70
          before:z-0
        bg-[var(--primary-color)] text-[var(--light-color)]"
      >
        {/* CONTENT (kept above overlay) */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-8">
            {/* LEFT: Text */}
            <div className="md:col-span-6 lg:col-span-5">
              <div className="max-w-xl">
                {/* Breadcrumb */}
                <p className="text-base mb-4 text-[var(--light-color)]">
                  <span className="font-semibold">MaxxStaminaPlus+</span>
                  <span className="mx-2">•</span>
                  <span className="text-[var(--primary-color)] font-bold">About</span>
                </p>

                {/* Big Heading */}
                <h1
                  className="font-extrabold leading-none tracking-tight -mt-2 text-[var(--light-color)]"
                  style={{
                    fontSize: "clamp(3.5rem, 9vw, 7.5rem)",
                    lineHeight: 0.9,
                  }}
                >
                  About
                </h1>
              </div>
            </div>

            {/* RIGHT: Product Image */}
            <div className="md:col-span-6 lg:col-span-7 flex justify-center md:justify-end">
              <div
                className="
                  relative
                  w-64 sm:w-80 md:w-[420px] lg:w-[520px]
                  before:content-[''] before:absolute before:inset-0
                  before:-z-10 before:rounded-2xl before:scale-110
                  before:blur-2xl before:opacity-60
                  before:bg-[var(--accent-color)]
                "
              >
                <Image
                  src="/assets/Images/ShilajitGoldResin.png"
                  alt="MaxxStaminaPlus product"
                  width={740}
                  height={420}
                  className="object-contain relative z-10 rounded-xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About / Details Section */}
  <section className="py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="rounded-2xl shadow-sm p-8 md:p-12 relative overflow-hidden bg-[var(--light-color)]">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Left: image stack (on small screens above text) */}
              <div className="md:col-span-6 flex justify-center md:justify-start">
                <div className="relative z-10 w-[340px] sm:w-[380px] md:w-[420px] lg:w-[520px]">
                  <Image
                    src="/assets/Images/Aboutus.png"
                    alt="Main product"
                    width={780}
                    height={520}
                    className="object-contain rounded-md"
                    priority
                  />
                </div>
              </div>

              {/* Right: text content */}
              <div className="md:col-span-6">
                <div className="max-w-xl">
                  <span className="inline-block mb-3 text-sm font-medium tracking-widest text-[var(--primary-color)]">
                    ABOUT THE AGENCY
                  </span>

                  <h2 className="text-2xl sm:text-3xl md:text-3xl text-[var(--primary-color)] font-extrabold mb-4">
                    Get to know about{" "}
                    <span className="block text-xl sm:text-2xl md:text-3xl text-[var(--dark-color)]">
                      <span className="font-black">MaxxStaminaPlus Marketing</span>
                    </span>
                  </h2>

                  <p className="text-base mb-4 text-[var(--text-muted)]">
                    Lorem ipsum dolor sit amet consectetur. Metus vitae a aenean mi aenean nulla elementum a eget viverra.
                    Tellus phasellus velit aliquam.
                  </p>

                  <p className="text-sm mb-6 text-[var(--text-muted)]">
                    Lorem ipsum dolor sit amet consectetur. Sagittis dignissim et tortor sem. Ut tempor velit magna aliquet
                    dignissim in purus molestie congue.
                  </p>

                  <button
                    className="inline-block text-[var(--light-color)] font-medium rounded-md px-6 py-3 shadow transition hover:opacity-90 bg-[var(--primary-color)]"
                    type="button"
                  >
                    Discover More
                  </button>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Testimonials */}
   
            <TestimonialSlider />
         
      
    </>
  );
}