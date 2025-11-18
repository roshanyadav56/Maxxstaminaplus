"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  // SAFE LocalStorage Reader
  const safeRead = (key) => {
    if (typeof window === "undefined") return null;
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const stored = safeRead("cart");
    if (stored) {
      const clean = stored.filter((p) => p && p.id);
      setCart(clean);
    }
  }, []);

  // Quantity Update
  const updateQty = (index, type) => {
    let updated = [...cart];
    let qty = updated[index].qty || 1;

    if (type === "inc") qty++;
    if (type === "dec") {
      if (qty > 1) qty--;
      else {
        updated.splice(index, 1);
        setCart(updated);
        localStorage.setItem("cart", JSON.stringify(updated));
        return;
      }
    }

    updated[index].qty = qty;
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // Subtotal & Total
  const subtotal = (item) => (item.currentPrice || 0) * (item.qty || 1);
  const total = cart.reduce((s, p) => s + subtotal(p), 0);

  // DISCOUNT CALCULATION
  const discountAmount = (total * discountPercent) / 100;
  const finalTotal = total - discountAmount;

  // Apply Coupon (silent)
  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();

    if (code === "DISCOUNT10") {
      setDiscountPercent(10); // 10% OFF
    } else {
      setDiscountPercent(0); // Invalid = remove discount
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">

      {/* HEADER */}
      <div className="hidden md:grid grid-cols-12 bg-[var(--light-color)] rounded-xl px-6 py-4 shadow-sm mb-6">
        <div className="col-span-6 font-semibold text-[var(--primary-color)]">Product</div>
        <div className="col-span-2 font-semibold text-[var(--primary-color)]">Price</div>
        <div className="col-span-2 font-semibold text-[var(--primary-color)]">Quantity</div>
        <div className="col-span-2 font-semibold text-[var(--primary-color)] text-right">Subtotal</div>
      </div>

      {/* CART ITEMS */}
      {cart.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-12 md:grid-cols-12 gap-4 md:gap-0 items-center bg-[var(--light-color)] rounded-xl px-4 md:px-6 py-4 shadow-sm mb-4"
        >
          {/* PRODUCT */}
          <div className="col-span-12 md:col-span-6 flex items-center gap-4">
            <div className="w-16 h-16 bg-[var(--bg-muted)] rounded overflow-hidden flex items-center justify-center">
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.name || "Product"}
                  width={60}
                  height={60}
                  className="object-contain"
                />
              )}
            </div>
            <div className="font-medium text-[var(--dark-color)] text-sm md:text-base">
              {item.name || "Product"}
            </div>
          </div>

          {/* PRICE */}
          <div className="col-span-4 md:col-span-2 font-semibold text-[var(--dark-color)]">
            ₹{item.currentPrice}
          </div>

          {/* QUANTITY */}
          <div className="col-span-4 md:col-span-2 flex items-center justify-start md:justify-center">
            <button
              onClick={() => updateQty(index, "dec")}
              className="w-8 h-8 bg-[var(--primary-color)] text-[var(--light-color)] rounded-l-lg flex items-center justify-center"
            >
              –
            </button>

            <div className="w-10 h-8 text-center border border-[var(--bg-muted)] py-1 text-[var(--text-muted)] font-semibold">
              {item.qty || 1}
            </div>

            <button
              onClick={() => updateQty(index, "inc")}
              className="w-8 h-8 bg-[var(--primary-color)] text-[var(--light-color)] rounded-r-lg flex items-center justify-center"
            >
              +
            </button>
          </div>

          {/* SUBTOTAL */}
          <div className="col-span-4 md:col-span-2 font-semibold text-[var(--dark-color)] text-right">
            ₹{subtotal(item)}
          </div>
        </div>
      ))}

      {/* BUTTONS */}
      <div className="flex flex-row justify-between mt-6 gap-4">
        <Link
          href="/products"
          className="px-6 py-3 text-center text-[var(--primary-color)] border border-[var(--primary-color)] rounded-lg hover:bg-[var(--bg-muted)]"
        >
          Return to Shop
        </Link>

        <button className="px-6 py-3 text-[var(--primary-color)] border border-[var(--primary-color)] rounded-lg hover:bg-[var(--bg-muted)]">
          Update Cart
        </button>
      </div>

      {/* CART TOTAL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">

        {/* COUPON BOX */}
        <div>
          <div className="flex w-full md:w-3/4">
            <input
              type="text"
              placeholder="Coupon Code"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              className="flex-1 border border-[var(--primary-color)] rounded-l-xl px-4 py-3 outline-none text-[var(--dark-color)]"
            />
            <button
              onClick={applyCoupon}
              className="bg-[var(--primary-color)] text-[var(--light-color)] px-6 py-3 rounded-r-xl text-sm font-medium hover:opacity-95"
            >
              Apply Coupon
            </button>
          </div>
        </div>

        {/* TOTAL BOX */}
        <div className="border border-[var(--bg-muted)] rounded-xl p-6 shadow-sm bg-[var(--light-color)]">
          <h2 className="text-xl font-bold text-[var(--dark-color)] mb-4">Cart Total</h2>

          {/* Subtotal */}
          <div className="flex justify-between mb-3 text-[var(--dark-color)]">
            <span className="font-medium">Subtotal:</span>
            <span className="font-semibold">₹{total}.00</span>
          </div>

          <hr />

          {/* DISCOUNT */}
          {discountPercent > 0 && (
            <div className="flex justify-between my-3 text-[var(--dark-color)]">
              <span className="font-medium">Discount ({discountPercent}%):</span>
              <span className="font-semibold text-green-600">-₹{discountAmount.toFixed(2)}</span>
            </div>
          )}

          {discountPercent > 0 && <hr />}

          {/* Shipping */}
          <div className="flex justify-between my-3 text-[var(--dark-color)]">
            <span className="font-medium">Shipping:</span>
            <span className="font-semibold">Free</span>
          </div>

          <hr />

          {/* Final Total */}
          <div className="flex justify-between mb-6 mt-3 text-[var(--dark-color)]">
            <span className="font-medium">Total:</span>
            <span className="font-semibold">₹{finalTotal.toFixed(2)}</span>
          </div>

          <button className="w-full bg-[var(--primary-color)] text-[var(--light-color)] py-3 rounded-lg font-medium hover:opacity-95">
            Proceed to checkout
          </button>
        </div>
      </div>
    </section>
  );
}
