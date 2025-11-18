"use client";
import { useState } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

const faqs = [
  {
    question: "Why is my stamina so poor?",
    answer:
      "Poor stamina can be the result of various factors, including a sedentary lifestyle, poor diet, lack of sleep, stress, or underlying health conditions. It could also be due to nutritional deficiencies, such as a lack of essential vitamins and minerals needed for energy production. Identifying and addressing these factors can help improve your stamina over time."
  },
  {
    question: "How to increase stamina and energy?",
    answer:
      "Regular exercise, proper sleep, good diet, hydration and stress reduction help improve stamina."
  },
  {
    question: "What supplements are good for increasing stamina?",
    answer:
      "Iron, Vitamin B12, Omega-3, Ashwagandha and Magnesium are helpful, but consult a doctor first."
  },
  {
    question: "Are the Cureayu Stamina Booster Products 100% Natural?",
    answer:
      "The company claims yes, but always check product labels for confirmation."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div
      className="max-w-7xl mx-auto px-10 py-10 rounded-2xl mt-14"
      style={{ backgroundColor: "var(--light-color)" }}
    >
      <h2
        className="text-3xl font-bold text-center mb-6"
        style={{ color: "var(--primary-color)" }}
      >
        Frequently Asked Questions
      </h2>

      {faqs.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={index}
            className="border-t py-4 transition-all duration-300"
            style={{ borderColor: "var(--bg-muted)" }}
          >
            <div
              className="flex justify-between items-center cursor-pointer text:md md:text-lg  font-semibold"
              style={{
                color: isOpen ? "var(--primary-color)" : "var(--dark-color)"
              }}
              onClick={() => toggleFAQ(index)}
            >
              {item.question}

              <span
                className="text-lg transition-colors duration-300"
                style={{
                  color: isOpen ? "var(--primary-color)" : "var(--dark-color)"
                }}
              >
                {isOpen ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </div>

            {isOpen && (
              <p
                className="mt-3 leading-relaxed transition-all text-sm duration-300"
                style={{ color: "var(--dark-color)" }}
              >
                {item.answer}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
