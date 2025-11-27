"use client";

import { useState } from "react";

export default function AuthenticatePage() {
  const [code, setCode] = useState("");
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  // Dummy DB (API later)
  const productDB = {
    "MSP123": {
      title: "MaxxStaminaPlus Shilajit Gold Resin",
      status: "ORIGINAL",
    },
    "MSP999": {
      title: "MaxxStaminaPlus Capsules 60 Count",
      status: "ORIGINAL",
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
      {/* INPUT SECTION */}
      <div className="w-full bg-[var(--light-color)] py-10 px-4">
        <h2 className="text-center text-lg sm:text-3xl font-bold text-[var(--primary-color)] mb-3 sm:mb-8">
          AUTHENTICATE
        </h2>
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

          </div>
        )}
      </div>
    </>
  );
}
