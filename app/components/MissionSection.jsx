"use client";

import Image from "next/image";
import { FaTruck } from "react-icons/fa";
import { GiHealthNormal } from "react-icons/gi";
import { MdHealthAndSafety } from "react-icons/md";

export default function MissionSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-6 sm:py-14 bg-[var(--light-color)] rounded-2xl">
 
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">

        {/* LEFT CONTENT */}
        <div className="mx-auto md:mx-10">
          <p className="text-[var(--primary-color)] font-semibold mb-3">
            Our Mission
          </p>

          <h2 className="text-4xl md:text-5xl font-bold text-[var(--dark-color)] leading-tight mb-8">
            Prioritising men's<br />health and wellness<br />in India
          </h2>

          <div className="space-y-6">

            {/* Point 1 */}
            <div className="flex items-center gap-4">
              <MdHealthAndSafety className="text-3xl text-[var(--primary-color)]" />
              <p className="text-lg font-semibold text-[var(--dark-color)]">
                Clinically Validated
              </p>
            </div>

            {/* Point 2 */}
            <div className="flex items-center gap-4">
              <GiHealthNormal className="text-3xl text-[var(--primary-color)]" />
              <p className="text-lg font-semibold text-[var(--dark-color)]">
                Safe & Effective
              </p>
            </div>

            {/* Point 3 */}
            <div className="flex items-center gap-4">
              <FaTruck className="text-3xl text-[var(--primary-color)]" />
              <p className="text-lg font-semibold text-[var(--dark-color)]">
                Discreet Delivery
              </p>
            </div>

          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="w-full">
          <Image
            src="/assets/images/MissionBottle.png"
            alt="Mission Image"
            width={600}
            height={600}
            className="rounded-2xl object-cover"
          />
        </div>

      </div>

    </section>
  );
}
