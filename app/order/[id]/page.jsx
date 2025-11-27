"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { orderDetails } from "../../components/DummyDB";
import { AiOutlineHome, AiOutlineUser } from "react-icons/ai";
import { BiSolidDownload } from "react-icons/bi";
import { BsCreditCard2Front } from "react-icons/bs";

const TIMELINE_STEPS = [
  { key: "confirmed", label: "Order Confirmed" },
  { key: "shipped", label: "Shipped" },
  { key: "outForDelivery", label: "Out For Delivery" },
  { key: "delivered", label: "Delivered" },
];

export default function OrderTrackingPage({ params }) {
  const resolvedParams =
    params && typeof params.then === "function" ? use(params) : params;
  const { id } = resolvedParams || {};

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  // ✅ NEW STATES FOR POPUP
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [otherReason, setOtherReason] = useState("");

  const fallbackImg = "/assets/Images/fallback-product.png";

  useEffect(() => {
    const loadOrder = () => {
      if (!id) return null;

      try {
        const history = JSON.parse(localStorage.getItem("orderHistory") || "[]");
        const match = history.find((o) => o.orderId === id);
        if (match) return match;

        const lastOrder = JSON.parse(localStorage.getItem("lastOrderDetails"));
        if (lastOrder && lastOrder.orderId === id) return lastOrder;
      } catch (e) { }

      if (orderDetails && orderDetails.orderId === id) return orderDetails;

      return null;
    };

    const resolved = loadOrder();
    setOrder(resolved);
    setLoading(false);
  }, [id]);

  if (loading)
    return (
      <div className="p-20 text-center text-lg font-semibold text-[var(--dark-color)]">
        Loading…
      </div>
    );

  if (!order)
    return (
      <div className="p-20 text-center">
        <h2 className="text-2xl font-bold text-[var(--dark-color)]">
          Order not found
        </h2>
        <p className="text-[var(--text-muted)] mt-2">
          Check your Order ID or go back to My Orders.
        </p>
        <div className="mt-4">
          <Link href="/account" className="text-[var(--primary-color)] font-medium">
            Back to My Account
          </Link>
        </div>
      </div>
    );

  const {
    items = [],
    summary = {},
    timeline = {},
    delivery = {},
    payment = {},
    status = "confirmed",
  } = order;

  const statusIndex = TIMELINE_STEPS.findIndex((s) => s.key === status);

  const isCancelled = status === "cancelled";
  const isDelivered = status === "delivered";

  // ✅ SUBMIT CANCEL WITH REASON
  const handleCancelSubmit = () => {
    const finalReason = cancelReason === "Other" ? otherReason : cancelReason;

    const updated = {
      ...order,
      status: "cancelled",
      cancellationReason: finalReason,
      refundStatus: payment?.method !== "Cash on Delivery" ? "Pending" : null,
    };

    try {
      const history = JSON.parse(localStorage.getItem("orderHistory") || "[]");
      const newHistory = history.map((o) =>
        o.orderId === order.orderId ? updated : o
      );
      localStorage.setItem("orderHistory", JSON.stringify(newHistory));
      localStorage.setItem("lastOrderDetails", JSON.stringify(updated));
    } catch (e) { }

    setOrder(updated);
    setShowCancelPopup(false);

    // ✅ Redirect ONLY if Online Payment
    if (payment?.method !== "Cash on Delivery") {
      window.location.href = `/refund?orderId=${order.orderId}`;
    }
  };


  const formatAmount = (v) =>
    Number(v === undefined || v === null ? 0 : v).toFixed(2);

  return (
    <section className="max-w-6xl mx-auto px-4 py-10 text-[var(--dark-color)]">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT SECTION */}
        <div className="lg:col-span-2 space-y-8">

          {/* ORDER HEADER CARD */}
          <div className="bg-[var(--light-color)] shadow rounded-xl p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-[var(--text-muted)]">
                  Order ID:{" "}
                  <span className="text-[var(--primary-color)] font-semibold">
                    {order.orderId}
                  </span>
                </p>

                <h1 className="text-2xl font-bold mt-1 text-[var(--dark-color)]">
                  {items[0]?.title || "Your Order"}
                </h1>

                <p className="text-sm text-[var(--text-muted)] mt-1">
                  Ordered on {order.orderDate || "—"}
                </p>
              </div>

              <div className="w-20 h-20 bg-[var(--bg-muted)] rounded-lg relative overflow-hidden">
                <Image
                  src={items[0]?.img || fallbackImg}
                  alt={items[0]?.title || "product"}
                  fill
                  className="object-contain p-2"
                />
              </div>
            </div>

            {/* ✅ CANCEL BUTTON */}
            {!isCancelled && !isDelivered && (
              <button
                onClick={() => setShowCancelPopup(true)}
                className="mt-4 px-5 py-2 rounded-lg font-medium transition
                           bg-[var(--primary-color)] text-[var(--light-color)]
                           hover:bg-[var(--dark-color)]"
              >
                Cancel Order
              </button>
            )}

            {/* ✅ CANCELLED BANNER */}
            {isCancelled && (
              <div className="mt-6 border-t pt-6">
                <div className="rounded-lg p-4 border 
                                bg-[var(--bg-muted)]/40 
                                border-[var(--primary-color)]/40">
                  <p className="font-semibold text-[var(--primary-color)]">
                    Order Cancelled
                  </p>
                  <p className="text-sm text-[var(--dark-color)]/70 mt-1">
                    This order was cancelled.
                  </p>

                  {order.cancellationReason && (
                    <p className="text-sm text-[var(--text-muted)] mt-1">
                      Reason: {order.cancellationReason}
                    </p>
                  )}
                </div>
              </div>
            )}
            {order.refundStatus && (
              <p className="text-sm text-green-600 font-medium mt-2">
                Refund Status: {order.refundStatus}
              </p>
            )}


            {/* ✅ TIMELINE SECTION (unchanged) */}
            {!isCancelled && (
              <div className="mt-6">
                {/* short view */}
                {!showAll && (
                  <div className="flex items-start gap-6">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-5 h-5 rounded-full ${statusIndex >= 0
                          ? "bg-[var(--success-color)]"
                          : "bg-[var(--bg-muted)]"
                          }`}
                      ></div>

                      <div className="w-1 h-10 bg-[var(--success-color)]/40 my-2" />

                      <div
                        className={`w-5 h-5 rounded-full ${statusIndex >= 3
                          ? "bg-[var(--success-color)]"
                          : "bg-[var(--bg-muted)]"
                          }`}
                      ></div>
                    </div>

                    <div>
                      <p className="font-semibold text-[var(--dark-color)]">
                        Order Confirmed — {timeline.confirmed || "—"}
                      </p>

                      <p className="font-semibold mt-12 text-[var(--success-color)]">
                        {status === "delivered"
                          ? `Delivered — ${timeline.delivered || "—"}`
                          : `Status: ${status}`}
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <button
                    onClick={() => setShowAll((s) => !s)}
                    className="text-[var(--primary-color)] font-medium"
                  >
                    {showAll ? "Hide Updates ▲" : "See All Updates ▼"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* OTHER ITEMS */}
          <div className="bg-[var(--light-color)] shadow rounded-xl p-6">
            <h3 className="text-lg font-semibold text-[var(--dark-color)]">
              Other Items In This Order
            </h3>

            <div className="mt-4 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border p-4 rounded-xl border-[var(--bg-muted)]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[var(--bg-muted)] rounded-lg relative overflow-hidden">
                      <Image
                        src={item.img || fallbackImg}
                        alt={item.title}
                        fill
                        className="object-contain p-2"
                      />
                    </div>

                    <div>
                      <p className="font-semibold text-[var(--dark-color)]">
                        {item.title}
                      </p>

                      <p
                        className={`text-xs mt-1 ${isCancelled
                          ? "text-[var(--primary-color)]"
                          : isDelivered
                            ? "text-[var(--success-color)]"
                            : "text-[var(--primary-color)]"
                          }`}
                      >
                        {isCancelled
                          ? "Cancelled"
                          : isDelivered
                            ? "Delivered"
                            : status}
                      </p>

                      <p className="text-xs text-[var(--text-muted)] mt-1">
                        Qty: {item.qty || 1}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-[var(--dark-color)]">
                      ₹{formatAmount(item.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <aside className="space-y-8">

          {/* DELIVERY DETAILS */}
          <div className="bg-[var(--light-color)] shadow rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 text-[var(--dark-color)]">
              Delivery details
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <AiOutlineHome size={22} className="text-[var(--dark-color)]/80 mt-1" />
                <div>
                  <p className="font-medium text-[var(--dark-color)]">
                    Home
                  </p>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                    {delivery?.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <AiOutlineUser size={22} className="text-[var(--dark-color)]/80 mt-1" />
                <div>
                  <p className="font-medium text-[var(--dark-color)]">
                    {delivery?.name || "Customer"}
                  </p>
                  <p className="text-sm text-[var(--text-muted)]">
                    {delivery?.phone || "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* PRICE DETAILS */}
          <div className="bg-[var(--light-color)] shadow rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-[var(--dark-color)]">
              Price details
            </h3>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--dark-color)]">Listing price</span>
                <span className="line-through text-[var(--text-muted)]">
                  ₹{summary.listingPrice?.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-[var(--dark-color)]">Special price</span>
                <span className="text-[var(--dark-color)]">
                  ₹{(summary.price || 0).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-[var(--dark-color)]">Other discount</span>
                <span className="text-[var(--primary-color)]">
                  -₹{(summary.discount || 0).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-[var(--dark-color)]">Total fees</span>
                <span className="text-[var(--dark-color)]">
                  ₹{(summary.fees || 0).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="border-t my-4 border-[var(--bg-muted)]"></div>

            <div className="flex justify-between items-center text-lg font-bold">
              <span className="text-[var(--dark-color)]">Total amount</span>
              <span className="text-[var(--dark-color)]">
                ₹{(summary.total || 0).toFixed(2)}
              </span>
            </div>

            <div className="mt-5 border rounded-xl p-3 flex items-center justify-between text-sm border-[var(--bg-muted)]">
              <span className="text-[var(--text-muted)]">Payment method</span>

              <span className="flex items-center gap-2 font-medium text-[var(--dark-color)]">
                <BsCreditCard2Front className="text-[var(--dark-color)]/80 text-lg" />
                {payment?.method || "—"}
              </span>
            </div>

            <button
              className="w-full mt-5 bg-[var(--light-color)] border font-semibold 
                         text-[var(--dark-color)] border-[var(--bg-muted)] py-3 rounded-xl 
                         flex items-center justify-center gap-2 hover:bg-[var(--bg-muted)]/30 transition"
            >
              <BiSolidDownload className="text-xl" />
              Download Invoice
            </button>
          </div>

          {/* OFFERS */}
          <div className="bg-[var(--light-color)] shadow rounded-xl p-6 text-sm 
                          flex items-center justify-between cursor-pointer text-[var(--dark-color)]">
            <span className="flex items-center gap-2">
              <span className="text-lg">🏆</span> Offers earned
            </span>
            <span className="text-[var(--text-muted)]">▼</span>
          </div>
        </aside>
      </div>

      {/* ✅ POPUP UI */}
      {showCancelPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999] px-4">
          <div className="bg-white w-full max-w-md rounded-xl p-6">

            <h2 className="text-xl font-bold text-[var(--dark-color)]">
              Cancel Order
            </h2>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Please tell us why you're cancelling this order
            </p>

            <div className="mt-4 space-y-3 text-sm">
              {[
                "Ordered by mistake",
                "Found cheaper somewhere else",
                "Delivery taking too long",
                "Need to change address/phone",
                "Other"
              ].map((reason) => (
                <label key={reason} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="cancelReason"
                    value={reason}
                    onChange={() => {
                      setCancelReason(reason);
                      if (reason !== "Other") setOtherReason("");
                    }}
                    className="accent-[var(--primary-color)]"
                  />
                  {reason}
                </label>
              ))}
            </div>

            {cancelReason === "Other" && (
              <input
                type="text"
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                placeholder="Please specify"
                className="w-full mt-3 border rounded-lg px-3 py-2 text-sm border-[var(--bg-muted)]"
              />
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCancelPopup(false)}
                className="px-5 py-2 rounded-lg border border-[var(--bg-muted)] text-sm"
              >
                Close
              </button>

              <button
                onClick={handleCancelSubmit}
                disabled={!cancelReason || (cancelReason === "Other" && !otherReason)}
                className={`px-6 py-2 rounded-lg text-white text-sm font-semibold
                  ${!cancelReason || (cancelReason === "Other" && !otherReason)
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[var(--primary-color)] hover:opacity-90"
                  }`}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
