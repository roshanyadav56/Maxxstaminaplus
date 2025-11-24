"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiSearch,
  FiHeart,
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX,
} from "react-icons/fi";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [favCount, setFavCount] = useState(0);

  const pathname = usePathname() || "/";

  // ⭐ SEARCH FUNCTION (navigate + close popup)
  const runSearch = (query) => {
    if (!query.trim()) return;

    window.location.href = `/products?search=${encodeURIComponent(query)}`;
    setMobileSearchOpen(false); // CLOSE POPUP
  };

  useEffect(() => {
    const updateCounts = () => {
      try {
        const c = JSON.parse(localStorage.getItem("cart") || "[]");
        const w = JSON.parse(localStorage.getItem("wishlist") || "[]");
        setCartCount(Array.isArray(c) ? c.length : 0);
        setFavCount(Array.isArray(w) ? w.length : 0);
      } catch (e) { }
    };

    updateCounts();
    window.addEventListener("localStorageUpdated", updateCounts);
    window.addEventListener("storage", updateCounts);

    return () => {
      window.removeEventListener("localStorageUpdated", updateCounts);
      window.removeEventListener("storage", updateCounts);
    };
  }, []);

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="w-full border-b border-[var(--bg-muted)] bg-[var(--light-color)] sticky top-0 z-50 text-[var(--dark-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between gap-4">

            {/* LEFT: Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/assets/logo.png"
                alt="MaxxStaminaPlus"
                width={90}
                height={45}
                className="object-contain"
                priority
              />
            </Link>



            {/* DESKTOP SEARCH */}
            <div className="hidden sm:flex flex-1 justify-center max-w-xs">
              <div className="relative w-full">
                <FiSearch className="absolute left-3 top-2.5 text-[var(--primary-color)] text-lg" />
                <input
                  value={searchText || ""}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && runSearch(searchText)}
                  type="text"
                  placeholder="Search Products..."
                  className="
    w-full bg-[var(--bg-muted)]/20 border border-transparent 
    text-sm rounded-full py-2 pl-10 pr-4 outline-none
  "
                />
              </div>
            </div>
            {/* ⭐⭐⭐ DESKTOP MENU (FIXED) ⭐⭐⭐ */}
            <nav className="hidden md:flex items-center gap-8 text-base font-medium ml-6">
              <Link
                href="/"
                className={`${isActive("/") ? "text-[var(--primary-color)]" : "text-[var(--dark-color)]"} hover:text-[var(--primary-color)]`}
              >
                Home
              </Link>

              <Link
                href="/about"
                className={`${isActive("/about") ? "text-[var(--primary-color)]" : "text-[var(--dark-color)]"} hover:text-[var(--primary-color)]`}
              >
                About
              </Link>

              <Link
                href="/products"
                className={`${isActive("/products") ? "text-[var(--primary-color)]" : "text-[var(--dark-color)]"} hover:text-[var(--primary-color)]`}
              >
                Products
              </Link>

              <Link
                href="/authenticate"
                className={`${isActive("/authenticate") ? "text-[var(--primary-color)]" : "text-[var(--dark-color)]"} hover:text-[var(--primary-color)]`}
              >
                Authenticate
              </Link>

              <Link
                href="/contact"
                className={`${isActive("/contact") ? "text-[var(--primary-color)]" : "text-[var(--dark-color)]"} hover:text-[var(--primary-color)]`}
              >
                Contact
              </Link>
            </nav>

            {/* RIGHT ICONS */}
            <div className="flex items-center gap-3">

              {/* Wishlist (desktop) */}
              <Link
                href="/wishlist"
                className={`hidden md:block relative ${isActive("/wishlist") ? "text-[var(--primary-color)]" : ""}`}
              >
                <FiHeart size={20} />
                {favCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[var(--primary-color)] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {favCount}
                  </span>
                )}
              </Link>

              {/* Cart (always visible) */}
              <Link
                href="/cart"
                className={`relative p-2 rounded-md hover:bg-[var(--bg-muted)] ${isActive("/cart") ? "text-[var(--primary-color)]" : ""}`}
              >
                <FiShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[var(--primary-color)] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Account (desktop) */}
              <Link
                href="/account"
                className={`hidden md:block ${isActive("/account") ? "text-[var(--primary-color)]" : ""}`}
              >
                <FiUser size={20} />
              </Link>

              {/* MOBILE SEARCH */}
              <button
                className="md:hidden p-2 rounded-md hover:bg-[var(--bg-muted)]"
                onClick={() => setMobileSearchOpen(true)}
              >
                <FiSearch size={22} />
              </button>

              {/* MOBILE MENU BUTTON */}
              <button
                onClick={() => setOpen(!open)}
                className="md:hidden p-2 rounded-md hover:bg-[var(--bg-muted)]"
              >
                {open ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
        {open && (
          <div className="md:hidden bg-[var(--primary-color)] p-4">
            <div className="space-y-3">

              {/* Mobile Links */}
              {["/", "/about", "/products", "/authenticate", "/contact"].map((href) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`block text-lg ${isActive(href) ? "text-white" : "text-white/80"}`}
                >
                  {href === "/" ? "Home" : href.replace("/", "").toUpperCase()}
                </Link>
              ))}

              <div className="flex flex-col gap-3 pt-3 border-t border-white/40">
                <Link href="/wishlist" onClick={() => setOpen(false)} className="text-white flex gap-2">
                  <FiHeart /> Wishlist
                </Link>
                <Link href="/account" onClick={() => setOpen(false)} className="text-white flex gap-2">
                  <FiUser /> Account
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* MOBILE SEARCH POPUP */}
        {mobileSearchOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-start justify-center p-4"
            onClick={() => setMobileSearchOpen(false)}
          >
            <div
              className="mt-20 bg-white w-full max-w-md rounded-xl p-5 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative mb-3">
                <FiSearch className="absolute left-3 top-3 text-gray-500" />
                <input
                  autoFocus
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && runSearch(searchText)}
                  placeholder="Search products..."
                  className="w-full bg-gray-100 border text-black rounded-lg py-2 pl-10 pr-4"
                />
              </div>

              <p className="font-semibold text-gray-700 mb-2">Categories</p>

              {["Shilajit", "Capsules", "Ayurvedic", "Best Sellers", "Combo Pack"].map(
                (cat, i) => (
                  <div
                    key={i}
                    className="py-2 px-3 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 cursor-pointer mb-2"
                    onClick={() => runSearch(cat)}
                  >
                    {cat}
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </header>
      <div className="marquee-wrapper bg-[#00008b] text-[var(--light-color)] py-2">
  <div className="marquee-track">

    {/* Track 1 */}
    <div className="flex gap-10 pr-10">
      <span>🔥 Boost Stamina Naturally With MaxxShilajit</span>
      <span>💥 Buy 1 Get 1 Free – Limited Offer!</span>
      <span>🚚 Free Shipping On Orders Over ₹999</span>
      <span>⭐ 100% Pure Himalayan Shilajit – Lab Tested</span>
      <span>⚡ Fast Delivery Across India</span>
    </div>

    {/* Track 2 - Duplicate */}
    <div className="flex gap-10 pr-10">
      <span>🔥 Boost Stamina Naturally With MaxxShilajit</span>
      <span>💥 Buy 1 Get 1 Free – Limited Offer!</span>
      <span>🚚 Free Shipping On Orders Over ₹999</span>
      <span>⭐ 100% Pure Himalayan Shilajit – Lab Tested</span>
      <span>⚡ Fast Delivery Across India</span>
    </div>

  </div>
</div>


    </>
  );
}
