"use client";

import { useState, useMemo, useEffect } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
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
  // WISHLIST LOCAL STORAGE
  // ================================
  const [wishlist, setWishlist] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const w = localStorage.getItem("wishlist");
    if (w) setWishlist(JSON.parse(w));
  }, []);

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

    if (showBestsellerOnly) sorted = sorted.filter((p) => p.isBestseller);
    if (NewArrivalOnly) sorted = sorted.filter((p) => p.isNewArrival);

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

    return sorted;
  }, [sortBy, showBestsellerOnly, NewArrivalOnly]);

  // ================================
  // PRODUCT CARD
  // ================================
  const ProductCard = ({ product }) => {
    const isWishlisted = wishlist.some((p) => p.id === product.id);

    return (
      <div className="relative group bg-[var(--light-color)] rounded-xl shadow-sm p-2 sm:p-4 hover:shadow-lg transition-all duration-300 border border-[var(--bg-muted)]">

        {/* ❤️ Wishlist */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="absolute top-3 sm:top-5 left-3 sm:left-5 z-30 p-1.5 sm:p-2 rounded-full bg-[var(--light-color)]"
        >
          {isWishlisted ? (
            <FaHeart className="text-xs sm:text-base text-[var(--primary-color)]" />
          ) : (
            <FaRegHeart className="text-xs sm:text-base text-[var(--primary-color)]" />
          )}
        </button>

        {/* NEW BADGE */}
        {product.isNewArrival && (
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-[var(--accent-color)] text-white px-2 py-[2px] text-[10px] sm:text-xs rounded-tr-md rounded-bl-md font-semibold z-30">
            NEW
          </div>
        )}

        {/* IMAGE */}
        <div
          className="relative w-full aspect-square mb-3 overflow-hidden rounded-md bg-[var(--bg-muted)] cursor-pointer"
          onClick={() => setSelectedProduct(product)}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-3 sm:p-5"
          />
        </div>

        {/* DETAILS */}
        <Link href={`/products/${product.id}`}>
          <div className="px-1 cursor-pointer">

            {/* NAME */}
            <h3 className="font-semibold text-[var(--dark-color)] text-xs sm:text-sm mb-1 truncate">
              {product.name}
            </h3>

            {/* PRICE ROW */}
            <div className="flex items-center gap-2 mb-1 flex-wrap">

              {/* CURRENT PRICE */}
              <span className="text-base sm:text-lg font-bold text-[var(--dark-color)]">
                ₹{product.currentPrice}
              </span>

              {/* OLD PRICE */}
              <span className="text-xs sm:text-sm line-through text-[var(--text-muted)]">
                ₹{product.oldPrice}
              </span>

              {/* DISCOUNT PILL */}
              <span className="text-[10px] sm:text-xs font-bold text-[var(--primary-color)] bg-[var(--primary-color)]/10 px-1.5 py-[1px] rounded">
                {product.discountPercent}% OFF
              </span>
            </div>

            {/* SAVE AMOUNT */}
            <div className="text-[var(--primary-color)] font-semibold text-xs sm:text-sm mb-1">
              Save ₹{product.saveAmount}
            </div>

          </div>
        </Link>
      </div>

    );
  };


  return (
    <section className="max-w-7xl mx-auto py-2 sm:py-4">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6  sm:px-4">
        {sortedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* ✅ POPUP */}
      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="relative w-[90%] max-w-sm bg-white rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-white bg-black/60 rounded-full px-2 py-1 z-50"
              onClick={() => setSelectedProduct(null)}
            >
              ✕
            </button>

            <div className="relative w-full h-72 sm:h-96">
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
