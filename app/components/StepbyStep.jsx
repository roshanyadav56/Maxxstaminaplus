"use client";

import Image from "next/image";

export default function HowToUse() {
  const steps = [
    {
      title: "STEP 1 : Measure",
      text: "Take 500mg (½ spoon), once a day if you do light workout & twice a day if you do intense workout.",
      image: "/assets/images/StepbyStep.png",
    },
    {
      title: "STEP 2 : Mix",
      text: "Mix well with a glass of lukewarm water or milk.",
      image: "/assets/images/StepbyStep.png",
    },
    {
      title: "STEP 3 : Drink",
      text: "Recommended daily as a pre-workout / after meals (except dinner) for visible results.",
      image: "/assets/images/StepbyStep.png",
    },
  ];

  return (
    <section className="mt-16">
      <h2 className="text-center text-2xl md:text-3xl font-bold text-[var(--dark-color)] mb-10">
        HOW TO USE THIS SUPPLEMENT?
      </h2>

      <div className="space-y-20">
        {steps.map((step, i) => {
          const reverse = i % 2 === 1; // 👉 Even rows image right

          return (
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
            >
              {/* IMAGE BLOCK */}
              <div className={`${reverse ? "md:order-2" : ""}`}>
                <div className="relative aspect-square rounded-xl overflow-hidden shadow">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover"
                  />

                  {/* STEP LABEL */}
                  <p className="absolute bottom-1 w-full text-center font-bold bg-white/70 text-black text-xs py-1">
                    {step.title}
                  </p>
                </div>
              </div>

              {/* TEXT BLOCK */}
              <div className={`${reverse ? "md:order-1" : ""}`}>
                <h3 className="text-[var(--primary-color)] text-xl font-bold mb-2">
                  {step.title}
                </h3>
                <p className="text-[var(--dark-color)] text-sm leading-relaxed">
                  {step.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
