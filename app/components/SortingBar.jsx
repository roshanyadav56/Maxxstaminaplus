"use client";

export default function SortingBar({ sortBy, setSortBy }) {
  return (
    <div className="w-full mb-2 sm:mb-8 rounded-xl flex justify-between items-center">
      <h2 className="text-xl sm:text-2xl font-bold text-[var(--dark-color)]">
        Grab the Best Deal on{" "}
        <span className="text-[var(--primary-color)]">Maxx Stamina Plus+</span>
      </h2>

      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="border px-3 py-2 rounded border-[var(--text-muted)] text-sm text-[var(--dark-color)]"
      >
        <option value="default">Sort By</option>
        <option value="priceLowToHigh">Low to High</option>
        <option value="priceHighToLow">High to Low</option>
        <option value="under199">Under 199</option>
        <option value="under399">Under 399</option>
        <option value="under599">Under 599</option>
        <option value="aToZ">A to Z</option>
        <option value="zToA">Z to A</option>
      </select>
    </div>
  );
}
