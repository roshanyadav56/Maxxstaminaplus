"use client";

import { useEffect, useState } from "react";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { MdAdd, MdDelete } from "react-icons/md";

export default function Checkout() {
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [orderId, setOrderId] = useState("");

  // NEW: coupon input
  const [couponInput, setCouponInput] = useState("");

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
  const [showPopup, setShowPopup] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState("");

  const [openMenu, setOpenMenu] = useState(null);

  // NEW: selected address index
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Load data on mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("userAddresses")) || [];
    setSavedAddresses(stored);

    // If no addresses -> show form
    if (stored.length === 0) setShowForm(true);

    // Load cart
    const loadCart = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartItems(cart);
      } catch (e) {
        setCartItems([]);
      }
    };

    loadCart();

    // BUY NOW logic (single product checkout)
    const singleProduct = JSON.parse(localStorage.getItem("checkoutProduct"));
    const fullCart = JSON.parse(localStorage.getItem("cart")) || [];

    if (singleProduct) {
      setCartItems([singleProduct]);
    } else {
      setCartItems(fullCart);
    }

    // Read applied coupon
    const savedCoupon = JSON.parse(localStorage.getItem("appliedCoupon"));
    setDiscount(savedCoupon?.discount || 0);

    // Read selected address index if previously stored
    const savedIndexRaw = localStorage.getItem("selectedCheckoutAddressIndex");
    const savedIndex =
      savedIndexRaw !== null && !isNaN(Number(savedIndexRaw))
        ? Number(savedIndexRaw)
        : null;

    if (savedIndex !== null && stored[savedIndex]) {
      setSelectedAddress(savedIndex);
    } else if (stored.length > 0) {
      // default to first address if none saved
      setSelectedAddress(0);
      localStorage.setItem("selectedCheckoutAddressIndex", "0");
    }

    // listen to storage changes
    window.addEventListener("localStorageUpdated", loadCart);
    window.addEventListener("storage", loadCart);

    return () => {
      window.removeEventListener("localStorageUpdated", loadCart);
      window.removeEventListener("storage", loadCart);
    };
  }, []);

  // PRICE CALCULATIONS
  const subtotal = cartItems.reduce(
    (sum, p) => sum + p.currentPrice * (p.qty || 1),
    0
  );

  const discountAmount = (subtotal * discount) / 100;
  const finalTotal = subtotal - discountAmount;

  const formatDate = (date) =>
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const generateOrderId = () => `MSP${Date.now()}`;

  // COUPON APPLY
  const applyCheckoutCoupon = () => {
    const code = couponInput.trim().toUpperCase();

    if (code === "DISCOUNT10") {
      setDiscount(10);
      localStorage.setItem(
        "appliedCoupon",
        JSON.stringify({ code: "DISCOUNT10", discount: 10 })
      );
    } else {
      setDiscount(0);
      localStorage.removeItem("appliedCoupon");
    }
  };

  // FORM HANDLERS
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    const newAddr = {
      tag: formValues.tag || "HOME",
      name: `${formValues.firstName} ${formValues.lastName}`.trim(),
      phone: formValues.phone,
      address: `${formValues.address}, ${formValues.city}, ${formValues.state}, ${formValues.country} - ${formValues.pincode}`,
    };

    const updated = [...savedAddresses, newAddr];
    localStorage.setItem("userAddresses", JSON.stringify(updated));
    setSavedAddresses(updated);
    setShowForm(false);

    // select newly added address
    const newIndex = updated.length - 1;
    setSelectedAddress(newIndex);
    localStorage.setItem(
      "selectedCheckoutAddressIndex",
      String(newIndex)
    );

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

    // adjust selectedAddress if needed
    if (selectedAddress === null) return;

    if (index === selectedAddress) {
      // deleted the selected one
      if (updated.length === 0) {
        setSelectedAddress(null);
        localStorage.removeItem("selectedCheckoutAddressIndex");
        localStorage.removeItem("selectedCheckoutAddress");
      } else {
        // choose nearest valid index (0)
        const newIndex = 0;
        setSelectedAddress(newIndex);
        localStorage.setItem("selectedCheckoutAddressIndex", String(newIndex));
        localStorage.setItem(
          "selectedCheckoutAddress",
          JSON.stringify(updated[newIndex])
        );
      }
    } else if (index < selectedAddress) {
      // shift left by one
      const newIndex = selectedAddress - 1;
      setSelectedAddress(newIndex);
      localStorage.setItem("selectedCheckoutAddressIndex", String(newIndex));
      if (updated[newIndex]) {
        localStorage.setItem(
          "selectedCheckoutAddress",
          JSON.stringify(updated[newIndex])
        );
      }
    }
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
            console.error("Error:", err);
          }
        },
        (err) => alert("Unable to get location: " + err.message)
      );
    } else {
      alert("Geolocation is not supported.");
    }
  };

  // When user selects an address (radio)
  const handleSelectAddress = (i) => {
    setSelectedAddress(i);
    localStorage.setItem("selectedCheckoutAddressIndex", String(i));
    if (savedAddresses[i]) {
      localStorage.setItem(
        "selectedCheckoutAddress",
        JSON.stringify(savedAddresses[i])
      );
    }
  };

  // PLACE ORDER
  const handlePlaceOrder = () => {
    if (savedAddresses.length > 0 && selectedAddress === null) {
      alert("Please select a delivery address!");
      return;
    }

    if (savedAddresses.length === 0) {
      alert("Please add an address before placing the order.");
      return;
    }

    const chosenAddress = savedAddresses[selectedAddress];

    // persist chosen address
    localStorage.setItem(
      "selectedCheckoutAddress",
      JSON.stringify(chosenAddress)
    );
    localStorage.setItem(
      "selectedCheckoutAddressIndex",
      String(selectedAddress)
    );

    // remove checkoutProduct if any
    localStorage.removeItem("checkoutProduct");

    const orderIdentifier = generateOrderId();
    setOrderId(orderIdentifier);

    const today = new Date();
    const confirmedDate = formatDate(today);
    const shippedDate = formatDate(new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000));
    const outForDeliveryDate = formatDate(new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000));
    const deliveredDate = formatDate(new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000));

    const orderSummary = {
      price: Number(subtotal.toFixed(2)),
      discountPercent: discount,
      discount: Number(discountAmount.toFixed(2)),
      delivery: 0,
      tax: 0,
      total: Number(finalTotal.toFixed(2)),
    };

    const orderPayload = {
      orderId: orderIdentifier,
      orderDate: confirmedDate,
      estimatedDelivery: deliveredDate,
      status: "confirmed",
      timeline: {
        confirmed: confirmedDate,
        shipped: shippedDate,
        outForDelivery: outForDeliveryDate,
        delivered: deliveredDate,
      },
      items: cartItems.map((item) => ({
        id: item.id,
        title: item.name,
        price: item.currentPrice,
        qty: item.qty || 1,
        img: item.image,
      })),
      summary: orderSummary,
      payment: {
        method: "Cash on Delivery",
      },
      delivery: {
        address: chosenAddress?.address || "",
      },
    };

    localStorage.setItem("lastOrderDetails", JSON.stringify(orderPayload));
    const history = JSON.parse(localStorage.getItem("orderHistory") || "[]");
    localStorage.setItem(
      "orderHistory",
      JSON.stringify([orderPayload, ...history])
    );

    const estimatedDateDisplay = deliveredDate;
    setDeliveryDate(estimatedDateDisplay);
    setShowPopup(true);

    // OPTIONAL: Clear cart or keep as-is depending on flow
    // localStorage.removeItem("cart");
    // setCartItems([]);
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

          {/* Saved addresses list */}
          {!showForm &&
            savedAddresses.length > 0 &&
            savedAddresses.map((addr, i) => (
              <div
                key={i}
                className={`relative border ${selectedAddress === i ? "ring-2 ring-[var(--primary-color)]" : "border-[#c9c9c9]"} rounded-xl p-5 mt-5 bg-[var(--light-color)] shadow-sm`}
              >
                {/* SELECT ADDRESS RADIO BUTTON */}
                <label className="absolute top-6 left-5">
                  <input
                    type="radio"
                    name="selectedAddress"
                    checked={selectedAddress === i}
                    onChange={() => handleSelectAddress(i)}
                    className="w-5 h-5 accent-[var(--primary-color)] cursor-pointer"
                  />
                </label>

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

                <span className="inline-block px-3 py-1 ms-7 rounded-full text-sm font-medium bg-[var(--primary-color)] text-[var(--light-color)] uppercase">
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

          {/* ADD ADDRESS FORM */}
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

        {/* RIGHT SIDE SUMMARY */}
        <div className="border border-[var(--bg-muted)] rounded-xl shadow-sm p-4 sm:p-6 bg-[var(--light-color)]">
          {cartItems.length === 0 ? (
            <p className="text-center text-[var(--text-muted)] py-6">
              Your cart is empty
            </p>
          ) : (
            <>
              {cartItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center text-[var(--dark-color)] font-medium py-3 border-b border-[var(--bg-muted)]"
                >
                  <div>
                    <p className="text-sm">{item.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">
                      Qty: {item.qty || 1}
                    </p>
                  </div>
                  <b>₹{(item.currentPrice * (item.qty || 1)).toFixed(2)}</b>
                </div>
              ))}

              {/* PRICES */}
              <div className="mt-6 space-y-2 text-[var(--dark-color)]">
                {/* Subtotal */}
                <div className="flex justify-between border-b border-[var(--bg-muted)] pb-2">
                  <span className="text-sm font-medium">Subtotal:</span>
                  <b className="text-sm">₹{subtotal.toFixed(2)}</b>
                </div>

                {/* Discount */}
                {discount > 0 && (
                  <div className="flex justify-between border-b border-[var(--bg-muted)] pb-2">
                    <span className="text-sm font-medium">
                      Discount ({discount}%):
                    </span>
                    <b className="text-sm text-green-600">
                      -₹{discountAmount.toFixed(2)}
                    </b>
                  </div>
                )}

                {/* Shipping */}
                <div className="flex justify-between border-b border-[var(--bg-muted)] pb-2">
                  <span className="text-sm font-medium">Shipping:</span>
                  <b className="text-sm text-[var(--primary-color)]">Free</b>
                </div>

                {/* Total */}
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>₹{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* COUPON INPUT */}
              <div className="mt-6 w-full flex">
                <input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-grow border border-[var(--primary-color)] text-[var(--dark-color)] px-4 py-3 rounded-l-xl outline-none text-sm h-12"
                  placeholder="Coupon Code"
                />

                <button
                  onClick={applyCheckoutCoupon}
                  className="bg-[var(--primary-color)] text-[var(--light-color)] px-6 rounded-r-xl font-medium hover:opacity-95 transition h-12 text-sm flex items-center"
                >
                  Apply Coupon
                </button>
              </div>

              <button
                onClick={handlePlaceOrder}
                className="w-full bg-[var(--primary-color)] text-[var(--light-color)] text-lg font-semibold py-4 rounded-xl mt-6 hover:opacity-95"
              >
                Place Order
              </button>
            </>
          )}
        </div>
      </div>

      {/* ORDER CONFIRMED POPUP */}
      {showPopup && (
        <div className="fixed inset-0 bg-[var(--dark-color)]/50 flex items-center justify-center z-[999] px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-center animate-fadeIn">
            <h2 className="text-2xl font-bold text-[var(--dark-color)]">
              Your order is confirmed
            </h2>

            <p className="text-[var(--text-muted)] mt-2">
              Thank you for shopping with us. <br />
              Your order will reach you on <b>{deliveryDate}</b>.
            </p>
            {orderId && (
              <p className="text-sm text-[var(--text-muted)] mt-1">
                Order ID: <span className="font-semibold text-[var(--primary-color)]">{orderId}</span>
              </p>
            )}

            {/* Show selected address summary */}
            <div className="mt-4 text-left bg-[var(--light-color)] p-4 rounded-lg border border-[var(--bg-muted)]">
              <h3 className="font-semibold text-[var(--dark-color)] mb-1">
                Delivering to:
              </h3>
              <p className="text-sm text-[var(--dark-color)]">
                {selectedAddress !== null && savedAddresses[selectedAddress]
                  ? `${savedAddresses[selectedAddress].name} • ${savedAddresses[selectedAddress].phone}`
                  : "No address selected"}
              </p>
              <p className="text-sm text-[var(--text-muted)] mt-2 break-words">
                {selectedAddress !== null && savedAddresses[selectedAddress]
                  ? savedAddresses[selectedAddress].address
                  : ""}
              </p>
            </div>

            <img
              src="\assets\Images\order-success.png"
              className="w-72 mx-auto mt-6"
              alt="Success"
            />

            <button
              onClick={() => {
                setShowPopup(false);
                window.location.href = orderId ? `/order/${orderId}` : "/";
              }}
              className="mt-6 bg-[var(--primary-color)] text-white px-6 py-3 rounded-xl font-semibold"
            >
              {orderId ? "Track Order" : "Continue Shopping"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
