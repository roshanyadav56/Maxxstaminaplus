"use client";

import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";
import Productss from "./Productslist";


export default function SortingBar() {
  return (
    <>
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 mt-5 sm:mt-15 rounded-xl flex justify-between items-center">
      
      {/* Left Heading */}
      <h2 className="text-lg sm:text-2xl font-bold text-[var(--dark-color)] ">
        Grab the Best Deal on{" "}
        <span className="text-[var(--primary-color)]">Maxx Stamina Plus+</span>
      </h2>

      {/* 👉 View All Button React Icon */}
      <Link
        href="/products"
        className="flex items-center justify-end gap-2 text-[var(--dark-color)] font-base hover:text-[var(--primary-color)] text-sm hover:underline w-32"
      >
        View All
        <FiChevronRight size={18} className="text-[var(--primary-color)] " />
      </Link>
    </div>
    <div className="max-w-7xl mx-auto px-3 sm:px-2">
    <Productss showBestsellerOnly={true} />
    </div>
    </>
  );
}
