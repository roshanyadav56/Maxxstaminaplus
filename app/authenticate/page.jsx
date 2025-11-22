"use client";

import { useState } from "react";
import Link from "next/link";

export default function AuthenticatePage() {
  const [code, setCode] = useState("");

  const handleSubmit = () => {
    if (!code.trim()) return alert("Please enter your product code");
    // Navigate or verify logic
    window.location.href = `/authenticate/result?code=${encodeURIComponent(code)}`;
  };

  return (
    <div className="w-full min-h-screen bg-white py-12 px-4">

      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto text-[14px] text-red-600 font-medium mb-6">
        <Link href="/" className="hover:underline">HOME</Link>
        <span className="mx-2">{">"}</span>
        <span className="text-red-600">AUTHENTICATE</span>
      </div>

      {/* Page Title */}
      <h1 className="text-center text-3xl font-bold text-red-600 mb-10 tracking-wide">
        AUTHENTICATE
      </h1>

      {/* Main Box */}
      <div className="max-w-4xl mx-auto border border-gray-300 p-10 mt-10">

        <div className="border border-gray-300 flex rounded-sm overflow-hidden">
          
          {/* Input */}
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            type="text"
            placeholder="AUTHENTICATE YOUR PRODUCT"
            className="flex-1 py-4 px-6 bg-gray-200 text-gray-700 uppercase outline-none"
          />

          {/* Button */}
          <button
            onClick={handleSubmit}
            className="bg-red-600 text-white px-8 text-lg font-semibold hover:bg-red-700 transition"
          >
            GO
          </button>

        </div>
      </div>
    </div>
  );
}
