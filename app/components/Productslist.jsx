"use client";

import { useState, useMemo, useEffect } from "react";
import { FaRegHeart, FaHeart, FaCartArrowDown } from "react-icons/fa";
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
  const [selectedProduct, setSelectedProduct] = useState(null);

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
  // SORTING + FILTERS
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

    // Show Only Top 4
    if (showBestsellerOnly || NewArrivalOnly || sortBy === "bestseller" || sortBy === "newarrival") {
      return sorted.slice(0, 4);
    }

    return sorted;
  }, [sortBy, showBestsellerOnly, NewArrivalOnly]);

  // ================================
  // PRODUCT CARD
  // ================================
  const ProductCard = ({ product }) => {
    const isWishlisted = wishlist.some((p) => p.id === product.id);

    return (
      <div
        onClick={() => setSelectedProduct(product)}
        className="relative group cursor-pointer"
      >
        <div className="block bg-[var(--light-color)] rounded-xl shadow-sm p-4 hover:shadow-lg transition-all duration-300 border border-[var(--bg-muted)] relative">

          {/* ❤️ Wishlist */}
          <button
            onClick={(e) => {
              e.stopPropagation();
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

          {/* Discount Badge */}
          {!product.isNewArrival && (
            <div className="absolute top-4 right-4 z-30 bg-[var(--primary-color)] text-white px-2 py-1 rounded-bl-lg rounded-tr-lg text-[10px] sm:text-sm shadow-md">
              <span className="font-semibold">{product.discountPercent}%</span><br />
              <span className="text-[8px] sm:text-[11px]">OFF</span>
            </div>
          )}

          {/* NEW Badge */}
          {product.isNewArrival && (
            <div className="absolute top-4 right-4 bg-[var(--accent-color)] text-white px-3 py-1 rounded-bl-xl rounded-tr-lg text-xs font-semibold">
              NEW
            </div>
          )}

          {/* Product Image */}
          <div className="relative w-full aspect-[4/3] mb-4 overflow-hidden rounded-md bg-[var(--bg-muted)]">
            <Image src={product.image} alt={product.name} fill className="object-contain p-6" />
          </div>

          {/* Name */}
          <h3 className="font-semibold text-[var(--dark-color)] text-sm mb-1 px-3 truncate">
            {product.name}
          </h3>

          {/* Prices */}
          <div className="flex items-center gap-3 mb-3 px-3">
            <span className="text-lg font-bold text-[var(--dark-color)]">
              ₹{product.currentPrice}
            </span>

            {!product.isNewArrival && (
              <span className="text-sm line-through text-[var(--text-muted)]">
                ₹{product.oldPrice}
              </span>
            )}
          </div>

          {/* Save */}
          {!product.isNewArrival && (
            <div className="text-[var(--primary-color)] font-semibold text-sm px-4 mb-3">
              Save ₹{product.saveAmount}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-2 sm:py-8">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sortedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* ================================
          POPUP / MODAL
      ================================= */}
    {selectedProduct && (
  <div
    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
    onClick={() => setSelectedProduct(null)}   // background click closes popup
  >
    <div
      className="relative w-[90%] max-w-sm bg-white rounded-xl overflow-hidden"
      onClick={(e) => e.stopPropagation()}  // prevent closing when clicking image container
    >

      {/* CLOSE BUTTON */}
      <button
        className="absolute top-2 right-2 text-white bg-black/60 rounded-full px-2 py-1 z-50"
        onClick={() => setSelectedProduct(null)}
      >
        ✕
      </button>

      {/* CLICKABLE IMAGE */}
      <div
        className="relative w-full h-72 sm:h-96 cursor-pointer"
        onClick={() => window.location.href = `/products/${selectedProduct.id}`}  
      >
        <Image
          src={selectedProduct.image}
          alt="product"
          fill
          className="object-contain bg-white p-4"
        />
      </div>

    </div>
  </div>
)}

    </section>
  );
}
