"use client";

import { useState, useMemo, useEffect } from "react";
import { FaRegHeart, FaHeart,FaCartArrowDown } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

export default function Productss({ showBestsellerOnly = false, NewArrivalOnly = false, sortBy }) {

  const products = [
    {
      id: 1,
      name: "SHILAJIT GOLD (15ml Pack)",
      image: "/assets/images/ShilajitGold.png",
      currentPrice: 459,
      oldPrice: 699,
      discountPercent: 34,
      saveAmount: 240,
      isBestseller: true,
      isNewArrival: false,
    },
    {
      id: 2,
      name: "SHILAJIT GOLD RESIN",
      image: "/assets/images/ShilajitGoldResin.png",
      currentPrice: 459,
      oldPrice: 699,
      discountPercent: 34,
      saveAmount: 240,
      isBestseller: false,
      isNewArrival: true,
    },
    {
      id: 3,
      name: "Extra Shot + (40 CAPSULES)",
      image: "/assets/images/ExtraShot.png",
      currentPrice: 499,
      oldPrice: 699,
      discountPercent: 28,
      saveAmount: 200,
      isBestseller: false,
      isNewArrival: true,
    },
    {
      id: 4,
      name: "SEXUAL WELLNESS SUPPLEMENT (60 CAPSULES)",
      image: "/assets/images/SexualWellness.png",
      currentPrice: 499,
      oldPrice: 699,
      discountPercent: 28,
      saveAmount: 200,
      isBestseller: true,
      isNewArrival: false,
    },
    {
      id: 5,
      name: "SHILAJIT GOLD (15ml Pack)",
      image: "/assets/images/ShilajitGold.png",
      currentPrice: 459,
      oldPrice: 699,
      discountPercent: 34,
      saveAmount: 240,
      isBestseller: true,
      isNewArrival: false,
    },
    {
      id: 6,
      name: "SHILAJIT GOLD RESIN",
      image: "/assets/images/ShilajitGoldResin.png",
      currentPrice: 459,
      oldPrice: 699,
      discountPercent: 34,
      saveAmount: 240,
      isBestseller: false,
      isNewArrival: true,
    },
    {
      id: 7,
      name: "Extra Shot + (40 CAPSULES)",
      image: "/assets/images/ExtraShot.png",
      currentPrice: 499,
      oldPrice: 699,
      discountPercent: 28,
      saveAmount: 200,
      isBestseller: false,
      isNewArrival: true,
    },
    {
      id: 8,
      name: "SEXUAL WELLNESS SUPPLEMENT (60 CAPSULES)",
      image: "/assets/images/SexualWellness.png",
      currentPrice: 499,
      oldPrice: 699,
      discountPercent: 28,
      saveAmount: 200,
      isBestseller: false,
      isNewArrival: false,
    },
  ];

  // ================================
  // CART + WISHLIST LOCAL STORAGE
  // ================================
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const c = localStorage.getItem("cart");
    const w = localStorage.getItem("wishlist");
    if (c) setCart(JSON.parse(c));
    if (w) setWishlist(JSON.parse(w));
  }, []);

  const addToCart = (product) => {
    if (cart.some((p) => p.id === product.id)) return;
    const updated = [...cart, product];
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const toggleWishlist = (product) => {
    let updated;
    if (wishlist.some((p) => p.id === product.id)) {
      updated = wishlist.filter((p) => p.id !== product.id);
    } else {
      updated = [...wishlist, product];
    }
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  // ================================
  // SORTING + Filters
  // ================================

  const sortedProducts = useMemo(() => {
  let sorted = [...products];

  // Filters
  if (showBestsellerOnly) sorted = sorted.filter((p) => p.isBestseller);
  if (NewArrivalOnly) sorted = sorted.filter((p) => p.isNewArrival);

  // Sorting
  switch (sortBy) {
    case "priceLowToHigh":
      sorted.sort((a, b) => a.currentPrice - b.currentPrice);
      break;
    case "priceHighToLow":
      sorted.sort((a, b) => b.currentPrice - a.currentPrice);
      break;
    case "under199":
      sorted = sorted.filter((p) => p.currentPrice <= 199);
      break;
    case "under399":
      sorted = sorted.filter((p) => p.currentPrice <= 399);
      break;
    case "under599":
      sorted = sorted.filter((p) => p.currentPrice <= 599);
      break;
    case "aToZ":
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "zToA":
      sorted.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case "bestseller":
      sorted = sorted.filter((p) => p.isBestseller);
      break;
    case "newarrival":
      sorted = sorted.filter((p) => p.isNewArrival);
      break;
    default:
      sorted.sort((a, b) => a.id - b.id);
      break;
  }

  // 🔥 SHOW ONLY TOP 3 for Bestseller OR New Arrival
  if (showBestsellerOnly || NewArrivalOnly || sortBy === "bestseller" || sortBy === "newarrival") {
    return sorted.slice(0, 3);
  }

  return sorted;
}, [sortBy, showBestsellerOnly, NewArrivalOnly]);


  // ================================
  // PRODUCT CARD
  // ================================
  const ProductCard = ({ product }) => {
  const isWishlisted = wishlist.some((p) => p.id === product.id);

  return (
    <div className="relative group">
      <Link
        href={`/products/${product.id}`}
        className="block bg-[var(--light-color)] rounded-xl shadow-sm p-4 hover:shadow-lg transition-all duration-300 border border-[var(--bg-muted)] relative"
      >
        {/* ❤️ Wishlist */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className="absolute top-5 left-5 z-30 p-2 rounded-full bg-[var(--light-color)]"
        >
          {isWishlisted ? (
            <FaHeart size={18} className="text-[var(--primary-color)]" />
          ) : (
            <FaRegHeart size={20} className="text-[var(--primary-color)]" />
          )}
        </button>

        {/* Discount Badge (only if NOT new arrival) */}
        {!product.isNewArrival && (
          <div className="absolute top-4 right-4 z-30 bg-[var(--primary-color)] text-[var(--light-color)] px-3 py-2 rounded-bl-xl rounded-tr-lg shadow-md text-center">
            <span className="text-sm font-semibold">{product.discountPercent}%</span>
            <br />
            <span className="text-[11px]">OFF</span>
          </div>
        )}

        {/* NEW badge */}
        {product.isNewArrival && (
          <div className="absolute top-4 right-4 z-30 bg-[var(--accent-color)] text-white px-3 py-1 rounded-bl-xl rounded-tr-lg text-xs font-semibold">
            NEW
          </div>
        )}

        {/* Product Image */}
        <div className="relative w-full aspect-[4/3] mb-4 overflow-hidden rounded-md bg-[var(--bg-muted)]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-6"
          />
        </div>

        {/* Name */}
        <h3 className="font-semibold text-[var(--dark-color)] text-sm mb-1 px-3 truncate">
          {product.name}
        </h3>

        {/* Prices */}
        <div className="flex items-center gap-3 mb-3 px-3">
          <span
            className={`text-lg font-bold ${
              product.isNewArrival
                ? "text-[var(--primary-color)]"
                : "text-[var(--dark-color)]"
            }`}
          >
            ₹{product.currentPrice}
          </span>

          {/* Old Price (hide for New Arrival) */}
          {!product.isNewArrival && (
            <span className="text-sm line-through text-[var(--text-muted)]">
              ₹{product.oldPrice}
            </span>
          )}
        </div>

        {/* Save Amount (hide for New Arrival) */}
        {!product.isNewArrival && (
          <div className="text-[var(--primary-color)] font-semibold text-sm px-4 mb-3">
            Save ₹{product.saveAmount}
          </div>
        )}

        {/* Add to Cart – NORMAL PRODUCTS (Hover big button) */}
        {!product.isNewArrival && (
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            className="
              absolute bottom-3 left-1/2 -translate-x-1/2 w-[85%]
              bg-[var(--primary-color)] text-[var(--light-color)] py-2 rounded-lg font-medium shadow
              opacity-0 translate-y-4
              group-hover:opacity-100 group-hover:translate-y-0
              transition-all duration-300
            "
          >
            Add to Cart
          </button>
        )}

        {/* Add to Cart – NEW ARRIVAL (Cart Icon bottom-right) */}
        {product.isNewArrival && (
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            className="
              absolute bottom-5 right-4
              hover:bg-[var(--primary-color)] hover:text-[var(--light-color)] text-[var(--primary-color)] p-3 rounded-full shadow-md
              hover:scale-110 transition-all duration-300
            "
          >
            <FaCartArrowDown size={20} />
          </button>
        )}
      </Link>
    </div>
  );
};


  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
