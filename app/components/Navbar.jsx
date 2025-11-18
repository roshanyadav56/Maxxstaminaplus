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
  const [cartCount, setCartCount] = useState(0);
  const [favCount, setFavCount] = useState(0);
  const pathname = usePathname() || "/";

  useEffect(() => {
    const updateCounts = () => {
      try {
        const c = JSON.parse(localStorage.getItem("cart") || "[]");
        const w = JSON.parse(localStorage.getItem("wishlist") || "[]");
        setCartCount(Array.isArray(c) ? c.length : 0);
        setFavCount(Array.isArray(w) ? w.length : 0);
      } catch (e) {
        // ignore
      }
    };

    updateCounts();
    // listen for our custom event (dispatched when code updates localStorage) and cross-tab storage events
    window.addEventListener("localStorageUpdated", updateCounts);
    window.addEventListener("storage", updateCounts);
    return () => {
      window.removeEventListener("localStorageUpdated", updateCounts);
      window.removeEventListener("storage", updateCounts);
    };
  }, []);

  // Helper to check if a nav item is active.
  // Uses startsWith so "/products" will be active also for "/products/123"
  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
  <header className="w-full border-b border-[var(--bg-muted)] bg-[var(--light-color)] sticky top-0 z-50 text-[var(--dark-color)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between gap-4">
          {/* LEFT: Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/assets/logo.png"
                alt="MaxxStaminaPlus"
                width={80}
                height={40}
                className="object-contain"
                priority
              />
            </Link>
          </div>

          {/* CENTER: Search */}
          <div className="flex-1 hidden sm:flex justify-center">
            <div className="relative w-full max-w-sm">
              <FiSearch className="absolute left-3 top-2.5 text-[var(--primary-color)] text-lg" />
              <input
                type="text"
                placeholder="Search Products........."
                className="w-full bg-[var(--bg-muted)]/20 border border-transparent focus:border-[var(--primary-color)] focus:ring-0 text-sm font-medium rounded-full py-2 pl-10 pr-4 shadow-sm placeholder:text-[var(--dark-color)] outline-none focus:outline-none"
              />
            </div>
          </div>

          {/* RIGHT: Links + Icons */}
          <div className="flex items-center gap-4">
            {/* Nav Links (hidden on mobile) */}
            <nav className="hidden md:flex items-center gap-6 text-base">
              <Link
                href="/"
                className={`${
                  isActive("/") ? "text-[var(--primary-color)] font-semibold" : "text-[var(--dark-color)]"
                } hover:text-[var(--primary-color)]`}
              >
                Home
              </Link>

              <Link
                href="/about"
                className={`${
                  isActive("/about") ? "text-[var(--primary-color)] font-semibold" : "text-[var(--dark-color)]"
                } hover:text-[var(--primary-color)]`}
              >
                About
              </Link>

              <Link
                href="/products"
                className={`${
                  isActive("/products") ? "text-[var(--primary-color)] font-semibold" : "text-[var(--dark-color)]"
                } hover:text-[var(--primary-color)]`}
              >
                Products
              </Link>

              <Link
                href="/contact"
                className={`${
                  isActive("/contact") ? "text-[var(--primary-color)] font-semibold" : "text-[var(--dark-color)]"
                } hover:text-[var(--primary-color)]`}
              >
                Contact
              </Link>
            </nav>

            {/* Divider */}
            <div className="hidden md:block h-6 w-px bg-[var(--bg-muted)]" />

            {/* Icons */}
            <div className="flex items-center gap-3 text-[var(--dark-color)]">
              {/* Favorite */}
              <Link
                href="/wishlist"
                className={`relative transition ${isActive("/wishlist") ? "text-[var(--primary-color)]" : "hover:text-[var(--primary-color)]"}`}
              >
                <FiHeart size={20} />
                {favCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[var(--primary-color)] text-[var(--light-color)] text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {favCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className={`relative transition ${isActive("/cart") ? "text-[var(--primary-color)]" : "hover:text-[var(--primary-color)]"}`}
              >
                <FiShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[var(--primary-color)] text-[var(--light-color)] text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User */}
              <Link
                href="/account"
                className={`transition ${isActive("/account") ? "text-[var(--primary-color)]" : "hover:text-[var(--primary-color)]"}`}
              >
                <FiUser size={20} />
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setOpen(!open)}
                className="md:hidden p-2 rounded-md hover:bg-[var(--bg-muted)]"
                aria-label="Toggle Menu"
              >
                {open ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden border-t bg-[var(--primary-color)] shadow-sm">
          <div className="px-4 py-3 space-y-2">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className={`block font-medium ${isActive("/") ? "text-[var(--light-color)]" : "text-[var(--light-color)]/90"}`}
            >
              Home
            </Link>

            <Link
              href="/about"
              onClick={() => setOpen(false)}
              className={`block font-medium ${isActive("/about") ? "text-[var(--light-color)]" : "text-[var(--light-color)]/90"}`}
            >
              About
            </Link>

            <Link
              href="/products"
              onClick={() => setOpen(false)}
              className={`block font-medium ${isActive("/products") ? "text-[var(--light-color)]" : "text-[var(--light-color)]/90"}`}
            >
              Products
            </Link>

            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className={`block font-medium ${isActive("/contact") ? "text-[var(--light-color)]" : "text-[var(--light-color)]/90"}`}
            >
              Contact
            </Link>

            {/* Search (mobile) */}
            <div className="relative mt-2">
              <FiSearch className="absolute left-3 top-2.5 text-[var(--light-color)] text-lg" />
              <input
                type="text"
                placeholder="Search Products..."
                className="w-full bg-[var(--bg-muted)] border border-transparent focus:border-[var(--light-color)] focus:ring-0 text-sm rounded-full py-2 pl-10 pr-4 shadow-sm placeholder:text-[var(--light-color)] outline-none focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
