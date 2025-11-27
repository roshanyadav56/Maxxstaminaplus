"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Cart() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState("");

  // ⭐ Generate stars
  const getStars = (rating) => {
    const stars = [];
    const full = Math.floor(rating);
    const half = rating % 1 !== 0;

    for (let i = 0; i < full; i++)
      stars.push(<span key={"full" + i} className="text-[var(--success-color)] text-sm">★</span>);

    if (half)
      stars.push(<span key="half" className="text-[var(--success-color)]/60 text-sm">★</span>);

    while (stars.length < 5)
      stars.push(<span key={"e" + stars.length} className="text-[var(--bg-muted)] text-sm">★</span>);

    return stars;
  };

  // ⭐ Safe Read
  const safeRead = (key) => {
    if (typeof window === "undefined") return null;
    try {
      return JSON.parse(localStorage.getItem(key)) || null;
    } catch {
      return null;
    }
  };

  // ⭐ Load Cart on Start
  useEffect(() => {
    const stored = safeRead("cart");
    if (stored) setCart(stored);

    const savedCoupon = safeRead("appliedCoupon");
    if (savedCoupon?.code === "DISCOUNT10") {
      setDiscountPercent(savedCoupon.discount);
    }
  }, []);

  // ⭐ Update Qty
  const updateQty = (index, type) => {
    let updated = [...cart];
    let qty = updated[index].qty || 1;

    if (type === "inc") {
      qty++;
    }

    if (type === "dec") {
      if (qty > 1) qty--;
      else {
        updated.splice(index, 1);   // REMOVE FROM CART
        setCart(updated);
        localStorage.setItem("cart", JSON.stringify(updated));
        return;
      }
    }

    updated[index].qty = qty;
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };


  // ⭐ Total Calculation
  const subtotal = (item) => item.currentPrice * (item.qty || 1);
  const total = cart.reduce((sum, p) => sum + subtotal(p), 0);
  const discountAmount = (total * discountPercent) / 100;
  const finalTotal = total - discountAmount;

  // ⭐ Apply Coupon
  const applyCoupon = () => {
    const code = coupon.toUpperCase();

    if (code === "DISCOUNT10") {
      setDiscountPercent(10);
      setCouponError("");
      localStorage.setItem("appliedCoupon", JSON.stringify({ code, discount: 10 }));
    } else {
      setDiscountPercent(0);
      setCouponError("Invalid");
      localStorage.removeItem("appliedCoupon");
    }
  };

  // ⭐ Checkout
  const handleCheckout = () => {
    if (!localStorage.getItem("loggedInUser")) {
      localStorage.setItem("redirectAfterLogin", "/checkout");
      router.push("/login");
      return;
    }
    router.push("/checkout");
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      {/* EMPTY CART MESSAGE */}
      {cart.length === 0 && (
        <div className="w-full flex flex-col items-center justify-center py-20">

          {/* OPTIONAL IMAGE */}
          {/* <Image src="/empty-cart.png" width={180} height={180} alt="Empty Cart" /> */}

          <h2 className="text-xl font-semibold text-[var(--dark-color)] mt-4">
            Your cart is empty
          </h2>

          <p className="text-[var(--text-muted)] mb-6">
            Add items to get started!
          </p>

          <Link
            href="/products"
            className="px-6 py-3 bg-[var(--primary-color)] text-[var(--light-color)] rounded-lg hover:opacity-90"
          >
            Continue Shopping
          </Link>
        </div>
      )}

      {/* CART ITEMS */}
      {cart.map((item, index) => {
        const qty = item.qty || 1;

        // ⭐ Qty multiplied prices
        const totalOldPrice = (item.oldPrice || 0) * qty;
        const totalNewPrice = (item.currentPrice || 0) * qty;

        return (
          <div
            key={index}
            className="bg-[var(--light-color)] rounded-xl px-4 md:px-6 py-4 shadow-sm mb-4"
          >
            {/* GRID */}
            <div className="grid grid-cols-12 gap-4 items-center">

              {/* LEFT — IMAGE + QTY */}
              <div className="col-span-4 md:col-span-5 flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-32">

                {/* Image */}
                <div className="w-20 h-20 bg-[var(--bg-muted)] rounded overflow-hidden flex items-center justify-center relative">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-1"
                    />
                  ) : (
                    <div className="text-xs text-gray-400">No Image</div>
                  )}
                </div>

                {/* Qty */}
                <div className="flex items-center">
                  <button
                    onClick={() => updateQty(index, "dec")}
                    className="w-6 h-6 bg-[var(--primary-color)] text-[var(--light-color)] rounded-l-md"
                  >
                    –
                  </button>

                  <div className="w-8 h-6 border border-[var(--bg-muted)] text-center text-[var(--dark-color)] font-semibold">
                    {qty}
                  </div>

                  <button
                    onClick={() => updateQty(index, "inc")}
                    className="w-6 h-6 bg-[var(--primary-color)] text-[var(--light-color)] rounded-r-md"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* MIDDLE — TITLE + RATING */}
              <div className="col-span-8 md:col-span-3">
                <h3 className="text-sm md:text-lg font-semibold text-[var(--dark-color)]">
                  {item.name}
                </h3>

                <div className="flex items-center gap-1 mt-1">
                  {getStars(item.rating || 4.2)}
                  <span className="text-[var(--text-muted)]">•</span>
                  <span className="text-[var(--text-muted)] text-sm">
                    ({item.reviews || 175})
                  </span>
                </div>

                {/* MOBILE PRICE */}
                <div className="flex md:hidden items-center gap-3 mt-3">
                  <span className="text-sm line-through text-[var(--text-muted)]">
                    ₹{totalOldPrice}
                  </span>

                  <span className="text-lg font-bold text-[var(--primary-color)]">
                    ₹{totalNewPrice}
                  </span>

                  <span className="text-sm font-semibold text-[var(--success-color)]">
                    ({item.discountPercent}% OFF)
                  </span>
                </div>
              </div>

              {/* RIGHT — DESKTOP PRICE */}
              <div className="hidden md:flex col-span-4 justify-end items-center flex-row gap-2">

                <span className="line-through text-[var(--text-muted)]">
                  ₹{totalOldPrice}
                </span>

                <span className="text-2xl font-bold text-[var(--primary-color)]">
                  ₹{totalNewPrice}
                </span>

                <span className="font-semibold text-[var(--success-color)]">
                  ({item.discountPercent}% OFF)
                </span>
              </div>
            </div>
          </div>
        );
      })}


      {/* TOTAL SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">

        {/* COUPON BOX */}
        <div>
          <div className="flex w-full md:w-3/4">
            <input
              type="text"
              placeholder="Coupon Code"
              value={coupon}
              onChange={(e) => {
                setCoupon(e.target.value);
                setCouponError("");
              }}
              className="flex-1 border border-[var(--primary-color)] rounded-l-xl px-4 py-3 text-[var(--dark-color)]"
            />

            <button
              onClick={applyCoupon}
              className="bg-[var(--primary-color)] text-[var(--light-color)] px-6 py-3 rounded-r-xl"
            >
              {discountPercent > 0 ? "Change" : "Apply"}
            </button>
          </div>

          {couponError && (
            <p className="text-red-600 text-sm mt-2">Invalid Coupon Code</p>
          )}
        </div>

        {/* TOTAL BOX */}
        <div className="border border-[var(--bg-muted)] rounded-xl p-6 bg-[var(--light-color)] shadow-sm">
          <h2 className="text-xl font-bold text-[var(--dark-color)] mb-4">Cart Total</h2>

          <div className="flex justify-between text-[var(--dark-color)]">
            <span>Subtotal:</span>
            <span className="font-semibold">₹{total}.00</span>
          </div>

          {discountPercent > 0 && (
            <div className="flex justify-between my-3 text-[var(--dark-color)]">
              <span>Discount:</span>
              <span className="font-semibold text-[var(--success-color)]">
                -₹{discountAmount.toFixed(2)}
              </span>
            </div>
          )}

          <div className="flex justify-between my-3 text-[var(--dark-color)]">
            <span>Shipping:</span>
            <span>Free</span>
          </div>

          <div className="flex justify-between mt-4 font-semibold text-[var(--primary-color)]">
            <span>Total:</span>
            <span>₹{finalTotal.toFixed(2)}</span>
          </div>

          <button
            onClick={cart.length === 0 ? null : handleCheckout}
            disabled={cart.length === 0}
            className={`w-full py-3 rounded-lg mt-6 
    ${cart.length === 0
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-[var(--primary-color)] text-[var(--light-color)] hover:opacity-95"
              }`
            }
          >
            Proceed to Checkout
          </button>

        </div>
      </div>
    </section>
  );
}
