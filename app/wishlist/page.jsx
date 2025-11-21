"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaHeart } from "react-icons/fa";

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [recentViews, setRecentViews] = useState([]);

  useEffect(() => {
    try {
      const w = localStorage.getItem("wishlist");
      if (w) setItems(JSON.parse(w));

      const viewedRaw = localStorage.getItem("justViewed");
      if (viewedRaw) {
        const parsed = JSON.parse(viewedRaw);
        setRecentViews(Array.isArray(parsed) ? parsed : []);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const addToCart = (product) => {
    try {
      const raw = localStorage.getItem("cart");
      const arr = raw ? JSON.parse(raw) : [];
      arr.push(product);
      localStorage.setItem("cart", JSON.stringify(arr));
      try { window.dispatchEvent(new Event("localStorageUpdated")); } catch (e) { }
    } catch (e) { }
  };

  const removeFromWishlist = (id) => {
    try {
      const raw = localStorage.getItem("wishlist");
      const arr = raw ? JSON.parse(raw) : [];
      const updated = arr.filter((p) => p.id !== id);
      localStorage.setItem("wishlist", JSON.stringify(updated));
      setItems(updated);
      try { window.dispatchEvent(new Event("localStorageUpdated")); } catch (e) { }
    } catch (e) { }
  };

  return (
    <>
      <section className="max-w-7xl mx-auto px-4 py-12">

        {/* Top Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-[var(--dark-color)]">
            Wishlist ({items.length})
          </h1>

          {items.length > 0 && (
            <button
              onClick={() => {
                items.forEach((i) => addToCart(i));
              }}
              className="px-6 py-2 bg-[var(--primary-color)] text-white rounded-lg shadow hover:opacity-90"
            >
              Move All To Cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="p-10 text-center text-[var(--text-muted)] text-lg">
            Your wishlist is empty.{" "}
            <Link href="/products" className="text-[var(--primary-color)] font-medium">
              Browse products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {items.map((product) => (
              <div
                key={product.id}
                className="relative bg-white rounded-xl overflow-visible border border-gray-200 shadow-sm z-10 p-4 hover:shadow-lg transition-all duration-300"
              >
                {/* Heart Icon */}
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-5 left-5 text-[var(--primary-color)] bg-[var(--light-color)] p-[6px] rounded-full z-20 shadow-sm hover:scale-110 transition"
                >
                  <FaHeart size={18} />
                </button>

                {/* Discount Badge */}
                <div className="absolute top-4 right-4 z-30 bg-[var(--primary-color)] text-[var(--light-color)] px-3 py-2 rounded-bl-xl rounded-tr-lg shadow-md">
                  <span className="text-sm font-semibold">{product.discountPercent}%</span>
                  <br />
                  <span className="text-[11px]">OFF</span>
                </div>

                {/* Product Image */}
                <Link href={`/products/${product.id}`}>
                  <div className="relative w-full aspect-[4/3] mb-3 overflow-hidden z-10 rounded-lg bg-gray-100">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-6"
                    />
                  </div>
                </Link>

                {/* Product Name */}
                <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2">
                  {product.name}
                </h3>

                {/* Prices */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-lg font-bold text-gray-900">
                    ₹{product.currentPrice}
                  </span>
                  <span className="text-sm line-through text-gray-400">
                    ₹{product.oldPrice}
                  </span>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => addToCart(product)}
                    className=" py-2 bg-[var(--primary-color)] text-white rounded-lg font-medium hover:opacity-90 mb-2 w-1/2"
                  >
                    Add to Cart
                  </button>

                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className=" py-2 border border-gray-300 rounded-lg text-[var(--primary-color)] font-medium hover:bg-gray-50  mb-2 w-1/2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

          </div>
        )}
      </section>
      {recentViews.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12 mt-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-8 bg-[var(--primary-color)] rounded-md"></div>
            <h2 className="text-2xl font-bold text-[var(--dark-color)]">
              Just Viewed Products
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recentViews
              .filter((product) => !items.some((wish) => wish.id === product.id))
              .slice(0, 8)
              .map((product) => (
                <div
                  key={product.id}
                  className="bg-[var(--light-color)] rounded-2xl border border-gray-200 shadow-sm overflow-hidden relative"
                >
                  <div className="absolute top-0 right-0 bg-[var(--primary-color)] text-[var(--light-color)] px-4 py-3 rounded-bl-2xl text-center leading-tight z-20">
                    <span className="text-sm font-semibold">
                      {product.discountPercent ?? product.discount ?? 0}%
                    </span>
                    <br />
                    <span className="text-[11px]">OFF</span>
                  </div>

                  <div className="w-full bg-[var(--bg-muted)] flex items-center justify-center p-6 min-h-[210px]">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={180}
                        height={180}
                        className="object-contain"
                      />
                    ) : product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={180}
                        height={180}
                        className="object-contain"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-white/70 flex items-center justify-center text-xs text-[var(--text-muted)]">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-[15px] mb-2 leading-tight text-[var(--dark-color)]">
                      {product.name}
                    </h3>

                    {product.currentPrice ?? product.price ? (
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg font-bold text-[var(--dark-color)]">
                          ₹{product.currentPrice ?? product.price}
                        </span>
                        {product.oldPrice && (
                          <span className="text-sm line-through text-[var(--text-muted)]">
                            ₹{product.oldPrice}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-[var(--text-muted)] mb-2">
                        Price unavailable
                      </div>
                    )}

                    {product.oldPrice &&
                      (product.currentPrice ?? product.price) && (
                        <div className="text-[var(--primary-color)] font-semibold mb-3">
                          Save – ₹
                          {(product.oldPrice || 0) -
                            (product.currentPrice ?? product.price ?? 0)}
                        </div>
                      )}
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

    </>
  );
}
