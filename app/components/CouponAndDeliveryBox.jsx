"use client";

import { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import { toast } from "react-hot-toast"; 

export default function CouponAndDeliveryBox() {
  const [pincode, setPincode] = useState("");
  const [deliveryMessage, setDeliveryMessage] = useState("");

  // ⭐ Coupon List
  const coupons = [
    { code: "FINFIRST25", offer: "Flat ₹25 Off*" },
    { code: "SAVE10", offer: "Extra 10% Off*" },
    { code: "FREESHIP", offer: "Free Shipping*" },
  ];

  // ⭐ COPY COUPON
  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Coupon "${code}" Copied!`);
  };

  // ⭐ DELIVERY DATE LOGIC
  const checkDelivery = () => {
    if (!/^\d{6}$/.test(pincode)) {
      toast.error("❌ Enter Valid 6 Digit Pincode!");
      return;
    }

    const today = new Date();
    today.setDate(today.getDate() + 4);

    const dateStr = today.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

    setDeliveryMessage(`🚚 Delivery expected by ${dateStr}`);
  };

  return (
    <div className="mt-10">

      {/* ⭐ TITLE */}
      <h2 className="font-semibold text-lg mb-3 text-[var(--dark-color)]">
        Available Offers
      </h2>

      {/* ⭐ HORIZONTAL COUPON SCROLLER */}
      <div
        className="
          flex gap-4 py-2 
          overflow-x-auto 
          scroll-smooth
          no-scrollbar       /* Hides scroll bar */
          w-full
        "
        style={{ maxWidth: "480px" }}   // ⬅️ Only fits 2 cards
      >
        {coupons.map((c, i) => (
          <div
            key={i}
            className="
              relative flex border rounded-xl shadow-md 
              bg-[var(--light-color)]
              w-64 min-w-[260px]   /* Card width */
              overflow-hidden
            "
          >
            {/* LEFT LABEL */}
            <div className=" bg-[var(--primary-color)] text-[var(--light-color)] px-2 py-4 font-semibold text-sm flex items-center justify-center">
             <span className="-rotate-90"> DISCOUNT </span>
            </div>

            {/* RIGHT CONTENT */}
            <div className="flex-1 p-3">
              <p className="text-xs text-[var(--dark-color)]">{c.offer}</p>

              <h3 className="font-bold text-[var(--dark-color)] text-lg">
                {c.code}
              </h3>

              <p className="text-[10px] text-[var(--dark-color)] leading-3 mt-1">
                *Terms & conditions apply
              </p>

              <button
                onClick={() => copyCode(c.code)}
                className="mt-3 w-full border text-[var(--dark-color)] border-[var(--dark-color)] rounded-full py-1 text-sm hover:bg-[var(--bg-muted)] transition"
              >
                Apply Code
              </button>
            </div>

            {/* CUTOUT */}
            <span className="absolute -left-[8px] top-1/2 -translate-y-1/2 w-4 h-4 bg-[var(--light-color)] rounded-full" />
            
          </div>
        ))}
      </div>

      {/* ⭐ HIDE SCROLLBAR CSS */}
      <style>
        {`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { scrollbar-width: none; }
      `}
      </style>

      {/* ⭐ DELIVERY SECTION */}
      <div className="mt-8">
        <h2 className="font-semibold text-lg mb-2 text-[var(--dark-color)]">
          Check Delivery Date
        </h2>

        <div className="flex border rounded-xl overflow-hidden w-full max-w-md bg-[var(--light-color)]">
          <span className="flex items-center px-3 text-[var(--primary-color)]">
            <FaMapMarkerAlt />
          </span>

          <input
            type="text"
            maxLength={6}
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            placeholder="Enter Pincode"
            className="flex-1 px-2 py-3 outline-none text-[var(--dark-color)]"
          />

          <button
            onClick={checkDelivery}
            className="bg-[var(--primary-color)] px-4 flex items-center justify-center text-[var(--light-color)] text-xl"
          >
            <FiArrowRight />
          </button>
        </div>

        {deliveryMessage && (
          <p className="mt-3 text-[var(--primary-color)] font-semibold">
            {deliveryMessage}
          </p>
        )}
      </div>
    </div>
  );
}
