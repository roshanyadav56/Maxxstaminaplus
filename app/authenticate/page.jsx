"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function AuthenticatePage() {
  const [code, setCode] = useState("");
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  // Dummy DB (API later)
  const productDB = {
    "MSP123": {
      title: "MaxxStaminaPlus Shilajit Gold Resin",
      image: "/assets/Images/ShilajitGoldResin.png",
      status: "ORIGINAL",
      batch: "BCH-9912",
      mfg: "12 Oct 2024",
      expiry: "12 Oct 2026",
    },
    "MSP999": {
      title: "MaxxStaminaPlus Capsules 60 Count",
      image: "/assets/Images/ShilajitGoldResin.png",
      status: "ORIGINAL",
      batch: "CAP-4521",
      mfg: "01 Aug 2024",
      expiry: "01 Aug 2026",
    },
  };

  const handleSubmit = () => {
    if (!code.trim()) {
      setError("Please enter your product code");
      return;
    }

    const result = productDB[code.trim().toUpperCase()];
    if (result) {
      setProduct(result);
      setError("");
    } else {
      setProduct(null);
      setError("Invalid Product Code! Please check again.");
    }
  };

  return (
    <>
      {/* HERO SECTION */}
      <section
        className="
        relative w-full min-h-[55vh] md:min-h-[70vh]
        flex items-center overflow-hidden
        bg-[var(--primary-color)]
        before:content-[''] before:absolute before:inset-0 
        before:bg-[var(--dark-color)] before:opacity-70 before:z-0
      "
      >
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">

            {/* LEFT */}
            <div className="md:col-span-6 lg:col-span-5 text-center md:text-left">
              <p className="text-[var(--light-color)] mb-4 text-sm sm:text-base">
                <Link href="/" className="underline">MaxxStaminaPlus+</Link>
                <span className="mx-2">•</span>
                <span className="font-bold text-[var(--primary-color)]">AUTHENTICATE</span>
              </p>

              <h1
                className="
                text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[0.9]
                text-[var(--light-color)]
              "
              >
                AUTHENTICATE
              </h1>
            </div>

            {/* RIGHT IMAGE */}
            <div className="md:col-span-6 lg:col-span-7 flex justify-center md:justify-end">
              <div
                className="
                relative w-56 sm:w-72 md:w-[380px] lg:w-[480px]
                before:content-[''] before:absolute before:inset-0
                before:-z-10 before:rounded-2xl before:scale-110
                before:blur-2xl before:opacity-50
                before:bg-[var(--accent-color)]
              "
              >
                <Image
                  src="/assets/Images/ShilajitGoldResin.png"
                  alt="Product"
                  width={700}
                  height={420}
                  className="object-contain z-10 relative rounded-xl"
                  priority
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* INPUT SECTION */}
      <div className="w-full bg-[var(--light-color)] py-10 px-4">
        <div className="max-w-2xl mx-auto border border-[var(--bg-muted)] p-6 sm:p-10">

          <div className="border border-[var(--bg-muted)] flex rounded-md overflow-hidden flex-row">

            {/* INPUT */}
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              type="text"
              placeholder="AUTHENTICATE YOUR PRODUCT"
              className=" min-w-0
              flex-1 py-4 px-6 
              bg-[var(--bg-muted)] 
              text-[var(--dark-color)] 
              placeholder-[var(--text-muted)]
              uppercase outline-none text-center sm:text-left
            "
            />

            {/* BUTTON */}
            <button
              onClick={handleSubmit}
              className=" w-24
              bg-[var(--primary-color)] 
              text-[var(--light-color)]
              py-4 px-8 text-lg font-semibold 
              hover:bg-[var(--accent-color)]
              transition shrink-0
            "
            >
              GO
            </button>
          </div>

          {error && (
            <p className="text-red-600 mt-4 text-center">{error}</p>
          )}
        </div>

        {/* PRODUCT DETAILS */}
        {product && (
          <div className="max-w-2xl mx-auto mt-10 p-6 border rounded-lg shadow border-[var(--bg-muted)]">

            <h2 className="text-2xl font-bold text-[var(--success-color)] mb-4">
              ✔ {product.status} PRODUCT VERIFIED
            </h2>

            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <Image
                src={product.image}
                width={200}
                height={150}
                className="rounded-md"
                alt="Verified Product"
              />

              <div>
                <h3 className="text-xl font-semibold text-[var(--dark-color)]">
                  {product.title}
                </h3>

                <p className="text-[var(--text-muted)] mt-2">
                  <b className="text-[var(--dark-color)]">Batch:</b> {product.batch}
                </p>

                <p className="text-[var(--text-muted)]">
                  <b className="text-[var(--dark-color)]">Mfg:</b> {product.mfg}
                </p>

                <p className="text-[var(--text-muted)]">
                  <b className="text-[var(--dark-color)]">Expiry:</b> {product.expiry}
                </p>
              </div>
            </div>

          </div>
        )}
      </div>
    </>
  );
}
