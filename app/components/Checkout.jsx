"use client";

import { useEffect, useState } from "react";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { MdAdd, MdDelete } from "react-icons/md";

export default function Checkout() {
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    altPhone: "",
    city: "",
    pincode: "",
    state: "",
    country: "",
    address: "",
    tag: "HOME",
  });

  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("userAddresses")) || [];
    setSavedAddresses(stored);
    if (stored.length === 0) setShowForm(true);

    // Read cart from localStorage
    const loadCart = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartItems(cart);
      } catch (e) {
        setCartItems([]);
      }
    };

    loadCart();

    // Listen for cart updates from custom event
    window.addEventListener("localStorageUpdated", loadCart);
    // Also listen for storage events (works cross-tab and within-tab in some cases)
    window.addEventListener("storage", loadCart);

    return () => {
      window.removeEventListener("localStorageUpdated", loadCart);
      window.removeEventListener("storage", loadCart);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    const newAddr = {
      tag: formValues.tag || "HOME",
      name: `${formValues.firstName} ${formValues.lastName}`,
      phone: formValues.phone,
      address: `${formValues.address}, ${formValues.city}, ${formValues.state}, ${formValues.country} - ${formValues.pincode}`,
    };

    const updated = [...savedAddresses, newAddr];
    localStorage.setItem("userAddresses", JSON.stringify(updated));
    setSavedAddresses(updated);
    setShowForm(false);
    setFormValues({
      firstName: "",
      lastName: "",
      phone: "",
      altPhone: "",
      city: "",
      pincode: "",
      state: "",
      country: "",
      address: "",
      tag: "HOME",
    });
  };

  const toggleMenu = (i) => {
    setOpenMenu(openMenu === i ? null : i);
  };

  const handleDeleteAddress = (index) => {
    const updated = savedAddresses.filter((_, i) => i !== index);
    setSavedAddresses(updated);
    localStorage.setItem("userAddresses", JSON.stringify(updated));
    setOpenMenu(null);
  };

  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
            );
            const data = await res.json();
            setFormValues((prev) => ({
              ...prev,
              city:
                data.address.city ||
                data.address.town ||
                data.address.village ||
                "",
              state: data.address.state || "",
              country: data.address.country || "",
              pincode: data.address.postcode || "",
              address: data.address.road
                ? `${data.address.road}, ${data.address.neighbourhood || ""}`
                : "",
            }));
          } catch (err) {
            console.error("Error fetching location:", err);
          }
        },
        (err) => {
          alert("Unable to get location: " + err.message);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-[var(--dark-color)]">
        Billing Details
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-10 items-start">
        <div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-3 w-full px-6 py-4 border rounded-xl text-[var(--primary-color)] border-[var(--primary-color)] font-semibold text-lg"
            >
              <span className="text-2xl">
                <MdAdd />{" "}
              </span>{" "}
              ADD A NEW ADDRESS
            </button>
          )}

          {!showForm &&
            savedAddresses.length > 0 &&
            savedAddresses.map((addr, i) => (
              <div
                key={i}
                className="border border-[#c9c9c9] rounded-xl p-5 mt-5 bg-[var(--light-color)] shadow-sm relative"
              >
                {/* Menu button */}
                <button
                  onClick={() => toggleMenu(i)}
                  className="absolute top-4 right-4 text-[var(--dark-color)] text-xl"
                >
                  ⋮
                </button>

                {/* Menu dropdown */}
                {openMenu === i && (
                  <div className="absolute top-10 right-4 shadow-lg bg-[var(--light-color)] border rounded-lg w-32 z-10">
                    <button
                      onClick={() => handleDeleteAddress(i)}
                      className="w-full text-left flex items-center px-4 py-2 hover:bg-[var(--primary-color)] hover:text-[var(--light-color)] text-sm text-[var(--primary-color)]"
                    >
                      <MdDelete /> Delete
                    </button>
                  </div>
                )}

                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-[var(--primary-color)] text-[var(--light-color)] uppercase">
                  {addr.tag}
                </span>

                <div className="flex flex-col sm:flex-row sm:justify-between mt-3 gap-1 sm:gap-0">
                  <p className="text-[17px] sm:text-[19px] font-bold text-[var(--dark-color)]">
                    {addr.name}
                  </p>
                  <p className="font-bold text-[var(--dark-color)] text-[17px]">
                    {addr.phone}
                  </p>
                </div>

                <p className="mt-2 text-[var(--dark-color)] leading-snug text-[14px] break-words">
                  {addr.address}
                </p>
              </div>
            ))}

          {showForm && (
            <>
              <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[var(--light-color)] px-4 sm:px-8 py-4 border border-[var(--bg-muted)] border-b-0 rounded-t-2xl shadow-sm gap-3 sm:gap-0">
                <h2 className="text-[var(--dark-color)] font-semibold text-2xl">
                  Add A New Address
                </h2>
                <button
                  type="button"
                  onClick={useCurrentLocation}
                  className="border border-[var(--primary-color)] text-[var(--primary-color)] px-4 py-2 rounded-lg flex items-center gap-2 text-sm sm:text-base"
                >
                  <FaLocationCrosshairs /> Use my current location
                </button>
              </div>

              <form
                onSubmit={handleSaveAddress}
                className="bg-[var(--light-color)] border border-[var(--bg-muted)] border-t-0 rounded-b-2xl shadow-sm px-4 sm:px-10 py-8 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6"
              >
                {/* FIRST NAME */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-[var(--primary-color)] mb-2">
                    First Name
                  </label>
                  <input
                    name="firstName"
                    value={formValues.firstName}
                    onChange={handleChange}
                    required
                    className="border-b text-[var(--dark-color)] border-[var(--dark-color)] pb-1 outline-none text-sm w-full"
                  />
                </div>

                {/* LAST NAME */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-[var(--primary-color)] mb-2">
                    Last Name
                  </label>
                  <input
                    name="lastName"
                    value={formValues.lastName}
                    onChange={handleChange}
                    required
                    className="border-b text-[var(--dark-color)] border-[var(--dark-color)] pb-1 outline-none text-sm w-full"
                  />
                </div>

                {/* MOBILE NUMBER */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-[var(--primary-color)] mb-2">
                    Mobile Number
                  </label>
                  <input
                    name="phone"
                    value={formValues.phone}
                    onChange={handleChange}
                    required
                    className="border-b text-[var(--dark-color)] border-[var(--dark-color)] pb-1 outline-none text-sm w-full"
                  />
                </div>

                {/* ALT NUMBER */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-[var(--primary-color)] mb-2">
                    Alternate Mobile Number (Optional)
                  </label>
                  <input
                    name="altPhone"
                    value={formValues.altPhone}
                    onChange={handleChange}
                    className="border-b text-[var(--dark-color)] border-[var(--dark-color)] pb-1 outline-none text-sm w-full"
                  />
                </div>

                {/* CITY */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-[var(--primary-color)] mb-2">
                    City/District/Town
                  </label>
                  <input
                    name="city"
                    value={formValues.city}
                    onChange={handleChange}
                    required
                    className="border-b text-[var(--dark-color)] border-[var(--dark-color)] pb-1 outline-none text-sm w-full"
                  />
                </div>

                {/* PIN CODE */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-[var(--primary-color)] mb-2">
                    Pin Code
                  </label>
                  <input
                    name="pincode"
                    value={formValues.pincode}
                    onChange={handleChange}
                    required
                    className="border-b text-[var(--dark-color)] border-[var(--dark-color)] pb-1 outline-none text-sm w-full"
                  />
                </div>

                {/* STATE */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-[var(--primary-color)] mb-2">
                    State
                  </label>
                  <input
                    name="state"
                    value={formValues.state}
                    onChange={handleChange}
                    required
                    className="border-b text-[var(--dark-color)] border-[var(--dark-color)] pb-1 outline-none text-sm w-full"
                  />
                </div>

                {/* COUNTRY */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-[var(--primary-color)] mb-2">
                    Country
                  </label>
                  <input
                    name="country"
                    value={formValues.country}
                    onChange={handleChange}
                    required
                    className="border-b text-[var(--dark-color)] border-[var(--dark-color)] pb-1 outline-none text-sm w-full"
                  />
                </div>

                {/* STREET ADDRESS FULL WIDTH */}
                <div className="flex flex-col col-span-1 sm:col-span-2">
                  <label className="text-sm font-semibold text-[var(--primary-color)] mb-2">
                    Street Address*
                  </label>
                  <input
                    name="address"
                    value={formValues.address}
                    onChange={handleChange}
                    required
                    className="border-b text-[var(--dark-color)] border-[var(--dark-color)] pb-1 outline-none text-sm w-full"
                  />
                </div>

                {/* SAVE INFO CHECKBOX */}
                <label className="col-span-1 sm:col-span-2 flex items-center gap-3 text-[var(--dark-color)] text-[16px] mt-4">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 accent-[var(--primary-color)]"
                  />
                  Save this information for faster check-out next time
                </label>

                {/* ACTION BUTTONS */}
                <div className="col-span-1 sm:col-span-2 flex flex-col sm:flex-row justify-center gap-4 mt-4">
                  <button
                    type="button"
                    className="w-full sm:w-auto px-10 py-3 rounded-xl border border-[var(--primary-color)] text-[var(--primary-color)] font-semibold text-[17px]"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-14 py-3 rounded-xl bg-[var(--primary-color)] text-[var(--light-color)] font-semibold text-[17px]"
                  >
                    Save
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        {/* ░░░ RIGHT SIDE ░░░ */}
        <div className="border border-[var(--bg-muted)] rounded-xl shadow-sm p-4 sm:p-6 bg-[var(--light-color)] mt-8 lg:mt-0">
          {/* PRODUCT LIST */}
          {cartItems.length === 0 ? (
            <p className="text-center text-[var(--text-muted)] py-6">Your cart is empty</p>
          ) : (
            <>
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-[var(--dark-color)] font-medium py-3 border-b border-[var(--bg-muted)]">
                  <div>
                    <p className="text-sm sm:text-base">{item.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">Qty: {item.qty || 1}</p>
                  </div>
                  <b className="text-sm sm:text-base">₹{(item.currentPrice * (item.qty || 1)).toFixed(2)}</b>
                </div>
              ))}

              {/* PRICES */}
              <div className="mt-6 space-y-2 text-[var(--dark-color)]">
                <div className="flex justify-between border-b border-[var(--bg-muted)] pb-2">
                  <span className="text-sm font-medium">Subtotal:</span>
                  <b className="text-sm">₹{cartItems.reduce((s, p) => s + (p.currentPrice * (p.qty || 1)), 0).toFixed(2)}</b>
                </div>

                <div className="flex justify-between border-b border-[var(--bg-muted)] pb-2">
                  <span className="text-sm font-medium">Shipping:</span>
                  <b className="text-sm text-[var(--primary-color)]">Free</b>
                </div>

                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>₹{cartItems.reduce((s, p) => s + (p.currentPrice * (p.qty || 1)), 0).toFixed(2)}</span>
                </div>
              </div>

              {/* PAYMENT */}
              <div className="mt-6 space-y-3 text-[var(--dark-color)] font-medium">
                <label className="flex gap-3 items-center cursor-pointer">
                  <input type="radio" name="payment" /> Bank
                </label>

                <label className="flex gap-3 items-center cursor-pointer">
                  <input type="radio" name="payment" defaultChecked /> Cash on delivery
                </label>
              </div>

              {/* COUPON */}
              <div className="mt-6 flex flex-col sm:flex-row gap-2">
                <input
                  className="flex-1 border border-[var(--primary-color)] px-4 py-3 rounded-l-xl text-[var(--dark-color)] placeholder-[var(--text-muted)] outline-none text-sm"
                  placeholder="Coupon Code"
                />
                <button className="bg-[var(--primary-color)] text-[var(--light-color)] px-6 rounded-r-xl font-medium hover:opacity-95 transition">
                  Apply Coupon
                </button>
              </div>

              <button className="w-full bg-[var(--primary-color)] text-[var(--light-color)] text-lg font-semibold py-4 rounded-xl mt-6 sm:mt-8 hover:opacity-95 transition">
                Place Order
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
