"use client";

import { useState } from "react";
import Productss from "../components/Productslist";
import SortingBar from "../components/SortingBar";

export default function Products() {
  const [sortBy, setSortBy] = useState("default");

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <SortingBar sortBy={sortBy} setSortBy={setSortBy} />
      <Productss sortBy={sortBy} />
    </section>
  );
}
