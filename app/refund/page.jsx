"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function RefundPage() {
  const params = useSearchParams();
  const orderId = params.get("orderId");

  const [method, setMethod] = useState("");
  const [upiId, setUpiId] = useState("");
  const [bankName, setBankName] = useState("");
  const [accName, setAccName] = useState("");
  const [accNumber, setAccNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    const data = {
      orderId,
      method,
      upiId,
      bankName,
      accName,
      accNumber,
      ifsc,
      status: "Refund Initiated",
      date: new Date().toISOString(),
    };

    localStorage.setItem("refund_" + orderId, JSON.stringify(data));
    setSubmitted(true);
  };

  return (
    <section className="max-w-lg mx-auto p-6 mt-8 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold text-gray-800">Refund Details</h1>
      <p className="text-sm text-gray-500 mt-1">
        Your order was cancelled. Please choose how you'd like to receive your refund.
      </p>

      {!submitted ? (
        <>
          {/* SELECT METHOD */}
          <h3 className="mt-6 font-semibold text-gray-800">Choose Refund Method</h3>

          <div className="mt-3 space-y-3 text-sm">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="refundMethod"
                value="UPI"
                onChange={() => setMethod("UPI")}
                className="accent-green-600"
              />
              UPI Transfer
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="refundMethod"
                value="BANK"
                onChange={() => setMethod("BANK")}
                className="accent-green-600"
              />
              Bank Account
            </label>
          </div>

          {/* UPI FORM */}
          {method === "UPI" && (
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                UPI ID
              </label>
              <input
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="example@upi"
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>
          )}

          {/* BANK FORM */}
          {method === "BANK" && (
            <div className="mt-4 space-y-3">
              <input
                placeholder="Account Holder Name"
                value={accName}
                onChange={(e) => setAccName(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
              <input
                placeholder="Account Number"
                value={accNumber}
                onChange={(e) => setAccNumber(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
              <input
                placeholder="IFSC Code"
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
              <input
                placeholder="Bank Name"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={
              !method ||
              (method === "UPI" && !upiId) ||
              (method === "BANK" && (!accName || !accNumber || !ifsc))
            }
            className={`w-full mt-6 py-3 rounded-lg text-white font-semibold
              ${!method ||
              (method === "UPI" && !upiId) ||
              (method === "BANK" && (!accName || !accNumber || !ifsc))
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
              }`}
          >
            Submit Refund Request
          </button>
        </>
      ) : (
        <div className="mt-6 text-center">
          <h2 className="text-xl font-bold text-green-600">Refund Initiated ✅</h2>
          <p className="text-sm text-gray-600 mt-2">
            Your refund will be processed within 3-5 business days.
          </p>

          <button
            onClick={() => (window.location.href = `/order/${orderId}`)}
            className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg font-semibold"
          >
            Go to Order Page
          </button>
        </div>
      )}
    </section>
  );
}
