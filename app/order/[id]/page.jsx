"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { orderDetails } from "../../components/DummyDB";

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

  useEffect(() => {
    const findOrder = () => {
      if (!id) return null;

      try {
        const history = JSON.parse(localStorage.getItem("orderHistory") || "[]");
        const match = history.find((entry) => entry.orderId === id);
        if (match) return match;

        const lastOrder = JSON.parse(
          localStorage.getItem("lastOrderDetails") || "null"
        );
        if (lastOrder && lastOrder.orderId === id) return lastOrder;
      } catch (error) {
        console.error("Failed to read order details", error);
      }

      if (orderDetails.orderId === id) {
        return orderDetails;
      }

      return null;
    };

    const resolvedOrder = findOrder();
    setOrder(resolvedOrder);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <section className="max-w-4xl mx-auto px-4 py-16 text-center text-[var(--dark-color)]">
        <div className="bg-[var(--light-color)] rounded-2xl shadow p-10">
          <p className="text-lg font-semibold">Loading your order…</p>
        </div>
      </section>
    );
  }

  if (!order) {
    return (
      <section className="max-w-4xl mx-auto px-4 py-16 text-center text-[var(--dark-color)]">
        <div className="bg-[var(--light-color)] rounded-2xl shadow p-10">
          <h1 className="text-3xl font-bold mb-4">Order not found</h1>
          <p className="text-[var(--text-muted)] mb-6">
            We couldn&apos;t locate an order with ID{" "}
            <span className="font-semibold text-[var(--primary-color)]">{id}</span>.
          </p>
          <Link
            href="/account"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary-color)] text-[var(--light-color)] font-semibold"
          >
            Back to My Account
          </Link>
        </div>
      </section>
    );
  }

  const items = order.items || [];
  const summary = order.summary || {};
  const timeline = order.timeline || {};
  const statusKey = order.status;
  const statusIndex = TIMELINE_STEPS.findIndex((step) => step.key === statusKey);
  const activeIndex = statusIndex >= 0 ? statusIndex : 0;
  const formatAmount = (value) => Number(value ?? 0).toFixed(2);

  return (
    <section className="max-w-6xl mx-auto px-4 py-10 text-[var(--dark-color)]">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div>
          <p className="text-sm text-[var(--text-muted)]">
            Order ID:{" "}
            <span className="font-semibold text-[var(--primary-color)]">
              {order.orderId}
            </span>
          </p>
          <h1 className="text-3xl font-bold mt-1">Track Your Order</h1>
          <p className="text-sm text-[var(--text-muted)] mt-2">
            Order date: {order.orderDate} &bull; Estimated delivery:{" "}
            <span className="text-[var(--primary-color)] font-medium">
              {order.estimatedDelivery}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="px-6 py-3 rounded-xl border border-[var(--primary-color)] text-[var(--primary-color)] font-semibold hover:bg-[var(--primary-color)] hover:text-[var(--light-color)] transition text-sm">
            Download Invoice
          </button>
          <Link
            href="/contact"
            className="px-6 py-3 rounded-xl bg-[var(--primary-color)] text-[var(--light-color)] font-semibold text-sm text-center"
          >
            Need Help?
          </Link>
        </div>
      </div>

      <div className="mt-10 bg-[var(--light-color)] rounded-2xl shadow p-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 ">
          {TIMELINE_STEPS.map((step, index) => {
            const isActive = index <= activeIndex;
            const isCompleted = index < activeIndex;
            const isLast = index === TIMELINE_STEPS.length - 1;

            return (
              <div key={step.key} className="flex flex-col items-center text-center">
                <p
                  className={`text-sm font-semibold ${
                    isActive ? "text-[var(--dark-color)]" : "text-[var(--text-muted)]"
                  }`}
                >
                  {step.label}
                </p>

                <div className="flex items-center w-full mt-4">
                  <span
                    className={`flex-1 h-1 ${
                      index === 0
                        ? "bg-transparent"
                        : isCompleted
                        ? "bg-[var(--dark-color)]"
                        : "bg-[var(--bg-muted)]"
                    }`}
                  />
                  <span
                    className={`w-5 h-5 rounded-full border-2 ${
                      isActive
                        ? "bg-[var(--primary-color)] border-[var(--primary-color)]"
                        : "border-[var(--bg-muted)] bg-[var(--light-color)]"
                    }`}
                  />
                  <span
                    className={`flex-1 h-1 ${
                      isLast
                        ? "bg-transparent"
                        : isActive
                        ? "bg-[var(--dark-color)]"
                        : "bg-[var(--bg-muted)]"
                    }`}
                  />
                </div>

                <p className="text-xs text-[var(--text-muted)] mt-4">
                  {timeline[step.key] || "—"}
                </p>
              </div>
            );
          })}
        </div>
 
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
        <div className="bg-[var(--light-color)] rounded-2xl shadow p-6 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border border-[var(--bg-muted)] rounded-xl p-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 relative bg-[var(--bg-muted)] rounded-lg overflow-hidden">
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-[var(--text-muted)]">
                    Qty: {item.qty}
                  </p>
                </div>
              </div>
              <p className="font-semibold text-lg">
                ₹{formatAmount((item.price || 0) * (item.qty || 1))}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-[var(--light-color)] rounded-2xl shadow p-6 space-y-4">
          <h2 className="text-xl font-bold">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Price</span>
              <span className="font-semibold">₹{formatAmount(summary.price)}</span>
            </div>
            <div className="flex justify-between">
              <span>
                Discount{" "}
                {typeof summary.discountPercent === "number"
                  ? `(${summary.discountPercent}%)`
                  : ""}
              </span>
              <span className="text-green-600">
                -₹{formatAmount(summary.discount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>₹{formatAmount(summary.delivery)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>₹{formatAmount(summary.tax)}</span>
            </div>
          </div>

          <div className="border-t border-[var(--bg-muted)] pt-4 flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>₹{formatAmount(summary.total || summary.price)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        <div className="bg-[var(--light-color)] rounded-2xl shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Payment</h3>
          <p className="text-[var(--text-muted)] text-sm">Method</p>
          <p className="font-medium mt-1">{order.payment?.method || "—"}</p>
        </div>

        <div className="bg-[var(--light-color)] rounded-2xl shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Delivery Address</h3>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            {order.delivery?.address || "—"}
          </p>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap gap-3 justify-end">
        <Link
          href="/account"
          className="px-6 py-3 rounded-xl border border-[var(--primary-color)] text-[var(--primary-color)] font-semibold hover:bg-[var(--primary-color)] hover:text-[var(--light-color)] transition text-sm"
        >
          Back to My Orders
        </Link>
        <button className="px-6 py-3 rounded-xl bg-[var(--primary-color)] text-[var(--light-color)] font-semibold text-sm">
          Contact Support
        </button>
      </div>
    </section>
  );
}

