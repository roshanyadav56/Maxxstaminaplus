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

  // coupon input
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

  // selected address index
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [couponError, setCouponError] = useState(false);

  // Payment method states
  const [paymentTab, setPaymentTab] = useState("UPI"); // "UPI" | "CARD" | "NETBANK" | "COD"
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardMM, setCardMM] = useState("");
  const [cardYY, setCardYY] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [cardName, setCardName] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [paymentErrors, setPaymentErrors] = useState({});
  const [paymentFormMessage, setPaymentFormMessage] = useState(""); // pretty grey bar message
  const [paymentValid, setPaymentValid] = useState(false); // whether online payment form is valid

  // order success image (uploaded file path)
  const orderSuccessImage = "/mnt/data/0221919e-8963-430f-917b-576a8ed7a93f.png";

  // Load data on mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("userAddresses")) || [];
    setSavedAddresses(stored);

    if (stored.length === 0) setShowForm(true);

    const loadCart = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartItems(cart);
      } catch (e) {
        setCartItems([]);
      }
    };

    loadCart();

    const singleProduct = JSON.parse(localStorage.getItem("checkoutProduct"));
    const fullCart = JSON.parse(localStorage.getItem("cart")) || [];

    if (singleProduct) {
      setCartItems([singleProduct]);
    } else {
      setCartItems(fullCart);
    }

    const savedCoupon = JSON.parse(localStorage.getItem("appliedCoupon"));
    setDiscount(savedCoupon?.discount || 0);

    const savedIndexRaw = localStorage.getItem("selectedCheckoutAddressIndex");
    const savedIndex =
      savedIndexRaw !== null && !isNaN(Number(savedIndexRaw))
        ? Number(savedIndexRaw)
        : null;

    if (savedIndex !== null && stored[savedIndex]) {
      setSelectedAddress(savedIndex);
    } else if (stored.length > 0) {
      setSelectedAddress(0);
      localStorage.setItem("selectedCheckoutAddressIndex", "0");
    }

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

  // online offer calculation (5% up to 100)
  const calcOnlineOffer = (amount) => Math.min((amount * 5) / 100, 100);

  // derive onlineOffer & onlinePayable based on current finalTotal and paymentValid + paymentTab
  const onlineOfferAmount =
    paymentTab !== "COD" && paymentValid ? calcOnlineOffer(finalTotal) : 0;
  const onlinePayable =
    paymentTab !== "COD" && paymentValid
      ? Number((finalTotal - onlineOfferAmount).toFixed(2))
      : Number(finalTotal.toFixed(2));

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

    if (code === "") {
      setCouponError(true);
      return;
    }

    if (code === "DISCOUNT10") {
      setDiscount(10);
      setCouponError(false);

      localStorage.setItem(
        "appliedCoupon",
        JSON.stringify({ code: "DISCOUNT10", discount: 10 })
      );
    } else {
      setCouponError(true);
      return;
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
      phone: `${formValues.countryCode || "+91"} ${formValues.phone}`,
      altPhone: formValues.altPhone ? `${formValues.altCountryCode || "+91"} ${formValues.altPhone}` : "",
      address: `${formValues.address}, ${formValues.city}, ${formValues.state}, ${formValues.country} - ${formValues.pincode}`,
    };

    const updated = [...savedAddresses, newAddr];
    localStorage.setItem("userAddresses", JSON.stringify(updated));
    setSavedAddresses(updated);
    setShowForm(false);

    const newIndex = updated.length - 1;
    setSelectedAddress(newIndex);
    localStorage.setItem("selectedCheckoutAddressIndex", String(newIndex));

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

    if (selectedAddress === null) return;

    if (index === selectedAddress) {
      if (updated.length === 0) {
        setSelectedAddress(null);
        localStorage.removeItem("selectedCheckoutAddressIndex");
        localStorage.removeItem("selectedCheckoutAddress");
      } else {
        const newIndex = 0;
        setSelectedAddress(newIndex);
        localStorage.setItem("selectedCheckoutAddressIndex", String(newIndex));
        localStorage.setItem(
          "selectedCheckoutAddress",
          JSON.stringify(updated[newIndex])
        );
      }
    } else if (index < selectedAddress) {
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

  // Validate payment fields before placing order
  const validatePayment = () => {
    const errors = {};
    let message = "";
    let valid = true;

    if (paymentTab === "UPI") {
      if (!upiId || upiId.trim().length < 3) {
        errors.upiId = "Enter a valid UPI ID";
        message = "Please Enter UPI id";
        valid = false;
      }
    } else if (paymentTab === "CARD") {
      const digits = cardNumber.replace(/\s+/g, "");
      if (!digits || digits.length < 12) {
        errors.cardNumber = "Enter valid card number";
        message = "Please Enter Card Details";
        valid = false;
      }
      if (!cardMM || !cardYY) {
        errors.expiry = "Enter expiry month and year";
        message = "Please Enter Card Details";
        valid = false;
      }
      if (!cardCVV || cardCVV.length < 3) {
        errors.cvv = "Enter valid CVV";
        message = "Please Enter Card Details";
        valid = false;
      }
      if (!cardName || cardName.trim().length < 2) {
        errors.cardName = "Enter cardholder name";
        message = "Please Enter Card Details";
        valid = false;
      }
    } else if (paymentTab === "NETBANK") {
      if (!selectedBank) {
        errors.bank = "Select a bank";
        message = "Select a bank to proceed";
        valid = false;
      }
    }

    setPaymentErrors(errors);
    setPaymentFormMessage(valid ? "" : message);
    setPaymentValid(valid);
    return valid;
  };

  // helpers to clear inline messages when user types
  const clearPaymentMessageOnInput = () => {
    if (paymentFormMessage) setPaymentFormMessage("");
    if (Object.keys(paymentErrors).length > 0) setPaymentErrors({});
    if (paymentValid) setPaymentValid(false); // revalidate next time explicitly
  };

  // PLACE ORDER
  const handlePlaceOrder = () => {
    // address checks (retain your existing logic)
    if (savedAddresses.length > 0 && selectedAddress === null) {
      alert("Please select a delivery address!");
      return;
    }

    if (savedAddresses.length === 0) {
      alert("Please add an address before placing the order.");
      return;
    }

    // payment validation for online methods
    if (paymentTab !== "COD") {
      const ok = validatePayment();
      if (!ok) {
        return;
      } else {
        setPaymentFormMessage("");
      }
    } else {
      setPaymentFormMessage("");
      setPaymentErrors({});
      setPaymentValid(false);
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

    // compute final order summary values
    const onlineOffer = paymentTab !== "COD" ? calcOnlineOffer(finalTotal) : 0;
    const totalAfterOnlineOffer = paymentTab !== "COD" ? Number((finalTotal - onlineOffer).toFixed(2)) : Number(finalTotal.toFixed(2));

    const orderSummary = {
      price: Number(subtotal.toFixed(2)),
      discountPercent: discount,
      discount: Number(discountAmount.toFixed(2)),
      onlineOffer: onlineOffer,
      delivery: 0,
      tax: 0,
      total: Number(totalAfterOnlineOffer.toFixed(2)),
    };

    // Payment details to store in payload
    let paymentPayload = { method: "Cash on Delivery" };
    if (paymentTab === "UPI") {
      paymentPayload = { method: "UPI", upiId: upiId.trim() };
    } else if (paymentTab === "CARD") {
      const mask = (num) => {
        const d = num.replace(/\s+/g, "");
        if (d.length <= 4) return d;
        return "**** **** **** " + d.slice(-4);
      };
      paymentPayload = {
        method: "Card",
        cardName: cardName,
        cardMasked: mask(cardNumber),
      };
    } else if (paymentTab === "NETBANK") {
      paymentPayload = { method: "Netbanking", bank: selectedBank };
    } else if (paymentTab === "COD") {
      paymentPayload = { method: "Cash on Delivery" };
    }

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
      payment: paymentPayload,
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
                <label className="absolute top-6 left-5">
                  <input
                    type="radio"
                    name="selectedAddress"
                    checked={selectedAddress === i}
                    onChange={() => handleSelectAddress(i)}
                    className="w-5 h-5 accent-[var(--primary-color)] cursor-pointer"
                  />
                </label>

                <button
                  onClick={() => toggleMenu(i)}
                  className="absolute top-4 right-4 text-[var(--dark-color)] text-xl"
                >
                  ⋮
                </button>

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

          {/* PAYMENT METHOD UI - LEFT SIDE, after addresses */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-[var(--dark-color)] mb-4">Choose Payment Method</h2>

            <div className="flex gap-4 flex-wrap">
              {/* UPI */}
              <button
                onClick={() => {
                  setPaymentTab("UPI");
                  setPaymentFormMessage("");
                  setPaymentValid(false);
                }}
                className={`flex-1 min-w-[140px] px-4 py-4 border rounded-lg text-left relative ${paymentTab === "UPI" ? "ring-2 ring-[var(--primary-color)] bg-[var(--light-color)]" : "border-[var(--bg-muted)] bg-white text-[var(--dark-color)]"}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-[var(--dark-color)] font-medium">UPI</div>
                  </div>
                  {paymentTab === "UPI" && <div className="absolute -top-2 -right-2 bg-[var(--primary-color)] text-[var(--dark-color)] rounded-sm text-white px-2 py-0.5 text-sm">✓</div>}
                </div>
              </button>

              {/* Card */}
              <button
                onClick={() => {
                  setPaymentTab("CARD");
                  setPaymentFormMessage("");
                  setPaymentValid(false);
                }}
                className={`flex-1 min-w-[140px] px-4 py-4 border rounded-lg text-left relative text-[var(--dark-color)] ${paymentTab === "CARD" ? "ring-2 ring-[var(--primary-color)] bg-[var(--light-color)]" : "border-[var(--bg-muted)] bg-white"}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Credit/Debit Card</div>
                  </div>
                  {paymentTab === "CARD" && <div className="absolute -top-2 -right-2 bg-[var(--primary-color)] rounded-sm text-white px-2 py-0.5 text-sm">✓</div>}
                </div>
              </button>

              {/* Netbanking */}
              <button
                onClick={() => {
                  setPaymentTab("NETBANK");
                  setPaymentFormMessage("");
                  setPaymentValid(false);
                }}
                className={`flex-1 min-w-[140px] px-4 py-4 border rounded-lg text-left relative text-[var(--dark-color)] ${paymentTab === "NETBANK" ? "ring-2 ring-[var(--primary-color)] bg-[var(--light-color)]" : "border-[var(--bg-muted)] bg-white"}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Netbanking</div>
                  </div>
                  {paymentTab === "NETBANK" && <div className="absolute -top-2 -right-2 bg-[var(--primary-color)] rounded-sm text-white px-2 py-0.5 text-sm">✓</div>}
                </div>
              </button>

              {/* COD */}
              <button
                onClick={() => {
                  setPaymentTab("COD");
                  setPaymentFormMessage("");
                  setPaymentValid(false);
                }}
                className={`flex-1 min-w-[140px] px-4 py-4 border rounded-lg text-left relative text-[var(--dark-color)] ${paymentTab === "COD" ? "ring-2 ring-[var(--primary-color)] bg-[var(--light-color)]" : "border-[var(--bg-muted)] bg-white"}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Cash On Delivery</div>
                  </div>
                  {paymentTab === "COD" && <div className="absolute -top-2 -right-2 bg-[var(--primary-color)] rounded-sm text-white px-2 py-0.5 text-sm">✓</div>}
                </div>
              </button>
            </div>

            {/* Selected payment form */}
            <div className="mt-6">
              {paymentTab === "UPI" && (
                <div>
                  <label className="block text-sm font-medium text-[var(--primary-color)] mb-2">Pay using UPI ID</label>
                  <input
                    value={upiId}
                    onChange={(e) => {
                      setUpiId(e.target.value);
                      setPaymentErrors((p) => ({ ...p, upiId: null }));
                      clearPaymentMessageOnInput();
                    }}
                    placeholder="Enter your UPI ID"
                    className={`w-full border rounded-lg px-4 py-3 text-[var(--dark-color)] outline-none ${paymentErrors.upiId ? "border-red-500" : "border-[var(--primary-color)]"}`}
                  />
                </div>
              )}

              {paymentTab === "CARD" && (
                <div>
                  <label className="block text-sm font-medium text-[var(--primary-color)] mb-2">Pay using Credit/Debit Card</label>

                  <input
                    value={cardNumber}
                    onChange={(e) => {
                      const v = e.target.value.replace(/[^\d\s]/g, "");
                      setCardNumber(v);
                      setPaymentErrors((p) => ({ ...p, cardNumber: null }));
                      clearPaymentMessageOnInput();
                    }}
                    placeholder="Card Number"
                    className={`w-full border text-[var(--dark-color)] rounded-lg px-4 py-3 mb-3 outline-none ${paymentErrors.cardNumber ? "border-red-500" : "border-[var(--primary-color)]"}`}
                  />

                  <div className="flex gap-3 mb-3">
                    <input
                      value={cardMM}
                      onChange={(e) => {
                        setCardMM(e.target.value.replace(/[^\d]/g, "").slice(0, 2));
                        clearPaymentMessageOnInput();
                      }}
                      placeholder="MM"
                      className={`w-1/3 border text-[var(--dark-color)] rounded-lg px-4 py-3 outline-none ${paymentErrors.expiry ? "border-red-500" : "border-[var(--primary-color)]"}`}
                    />
                    <input
                      value={cardYY}
                      onChange={(e) => {
                        setCardYY(e.target.value.replace(/[^\d]/g, "").slice(0, 2));
                        clearPaymentMessageOnInput();
                      }}
                      placeholder="YY"
                      className={`w-1/3 border text-[var(--dark-color)] rounded-lg px-4 py-3 outline-none ${paymentErrors.expiry ? "border-red-500" : "border-[var(--primary-color)]"}`}
                    />
                    <input
                      value={cardCVV}
                      onChange={(e) => {
                        setCardCVV(e.target.value.replace(/[^\d]/g, "").slice(0, 4));
                        clearPaymentMessageOnInput();
                      }}
                      placeholder="CVV"
                      className={`w-1/3 border text-[var(--dark-color)] rounded-lg px-4 py-3 outline-none ${paymentErrors.cvv ? "border-red-500" : "border-[var(--primary-color)]"}`}
                    />
                  </div>

                  <input
                    value={cardName}
                    onChange={(e) => {
                      setCardName(e.target.value);
                      setPaymentErrors((p) => ({ ...p, cardName: null }));
                      clearPaymentMessageOnInput();
                    }}
                    placeholder="Cardholder Name"
                    className={`w-full border text-[var(--dark-color)] rounded-lg px-4 py-3 outline-none ${paymentErrors.cardName ? "border-red-500" : "border-[var(--primary-color)]"}`}
                  />
                </div>
              )}

              {paymentTab === "NETBANK" && (
                <div>
                  <label className="block text-sm font-medium text-[var(--primary-color)] mb-2">Netbanking</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => {
                      setSelectedBank(e.target.value);
                      setPaymentErrors((p) => ({ ...p, bank: null }));
                      clearPaymentMessageOnInput();
                    }}
                    className={`w-full border text-[var(--dark-color)] rounded-lg px-4 py-3 outline-none ${paymentErrors.bank ? "border-red-500" : "border-[var(--primary-color)]"}`}
                  >
                    <option value="">Select Bank</option>
                    <option value="HDFC">HDFC Bank</option>
                    <option value="SBI">State Bank of India</option>
                    <option value="ICICI">ICICI Bank</option>
                    <option value="AXIS">Axis Bank</option>
                    <option value="Kotak">Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}

              {paymentTab === "COD" && (
                <div>
                  <p className="text-sm text-[var(--text-muted)]">You will pay at the time of delivery.</p>
                </div>
              )}
            </div>

            {/* Pretty inline error / informational grey bar (screenshot style) */}
            {paymentFormMessage ? (
              <div className="mt-6 bg-gray-400 rounded-lg py-4 text-center text-white font-semibold">
                {paymentFormMessage}
              </div>
            ) : (
              paymentTab !== "COD" && (
                <p className="mt-6 text-center text-sm text-[#c96e4f]">
                  Enjoy the extra 5% online payment discount
                </p>
              )
            )}
          </div>

          {/* ADD ADDRESS FORM (unchanged) */}
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

                  <div className="flex gap-2 items-center">
                    <select
                      name="countryCode"
                      defaultValue="+91"
                      className="border-b border-[var(--dark-color)] bg-transparent text-[var(--dark-color)] pb-1 outline-none text-sm w-20"
                    >
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+971">🇦🇪 +971</option>
                      <option value="+61">🇦🇺 +61</option>
                      <option value="+81">🇯🇵 +81</option>
                    </select>

                    <input
                      name="phone"
                      value={formValues.phone}
                      maxLength="10"
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        setFormValues((prev) => ({ ...prev, phone: value }));
                      }}
                      required
                      className="flex-1 border-b text-[var(--dark-color)] border-[var(--dark-color)] pb-1 outline-none text-sm"
                      placeholder="Enter 10 digit number"
                    />
                  </div>
                </div>

                {/* ALT NUMBER */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-[var(--primary-color)] mb-2">
                    Alternate Mobile Number (Optional)
                  </label>

                  <div className="flex gap-2 items-center">
                    <select
                      name="altCountryCode"
                      defaultValue="+91"
                      className="border-b border-[var(--dark-color)] bg-transparent text-[var(--dark-color)] pb-1 outline-none text-sm w-20"
                    >
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+971">🇦🇪 +971</option>
                      <option value="+61">🇦🇺 +61</option>
                      <option value="+81">🇯🇵 +81</option>
                    </select>

                    <input
                      name="altPhone"
                      value={formValues.altPhone}
                      maxLength="10"
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        setFormValues((prev) => ({ ...prev, altPhone: value }));
                      }}
                      className="flex-1 border-b text-[var(--dark-color)] border-[var(--dark-color)] pb-1 outline-none text-sm"
                      placeholder="Optional"
                    />
                  </div>
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

                {/* Discount (coupon) */}
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

                {/* Online Payment Offer (only show when online method chosen & payment valid) */}
                {paymentTab !== "COD" && paymentValid && (
                  <div className="flex justify-between border-b text-[var(--dark-color)] border-[var(--bg-muted)] pb-2">
                    <span className="text-sm font-medium">Online Payment Offer (5% upto ₹100):</span>
                    <b className="text-sm text-green-600">-₹{onlineOfferAmount.toFixed(2)}</b>
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
                  <span>₹{(paymentTab !== "COD" && paymentValid ? onlinePayable : finalTotal).toFixed(2)}</span>
                </div>
              </div>

              {/* COUPON INPUT */}
              <div className="mt-6 w-full flex">
                <input
                  value={couponInput}
                  onChange={(e) => {
                    setCouponInput(e.target.value);
                    setCouponError(false);
                  }}
                  className={`flex-grow border ${couponError ? "border-red-500" : "border-[var(--primary-color)]"
                    } text-[var(--dark-color)] px-4 py-3 rounded-l-xl outline-none text-sm h-12`}
                  placeholder="Coupon Code"
                />

                <button
                  onClick={applyCheckoutCoupon}
                  disabled={couponError || couponInput.trim() === ""}
                  className={`px-6 h-12 rounded-r-xl font-medium flex items-center
      ${discount > 0
                      ? "bg-[var(--primary-color)] text-[var(--light-color)]"
                      : "bg-[var(--primary-color)] text-[var(--light-color)]"
                    }
      ${couponError || couponInput.trim() === ""
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer hover:opacity-95"
                    }
    `}
                >
                  {discount > 0 ? "Change" : "Apply"}
                </button>
              </div>

              {couponError && (
                <p className="text-red-500 text-sm mt-2">
                  Invalid coupon code. Try again.
                </p>
              )}

              {/* Small orange strip above CTA */}
              <p className="text-center mt-4 text-sm text-[#c96e4f]">Pay online to get extra 5% upto Rs. 100</p>

              {/* CTA */}
              <button
                onClick={handlePlaceOrder}
                disabled={paymentTab !== "COD" && !paymentValid}
                className={`w-full mt-4 rounded-xl text-white text-lg font-semibold py-4 ${paymentTab === "COD" ? "bg-[var(--primary-color)]" : "bg-[var(--primary-color)]"} ${paymentTab !== "COD" && !paymentValid ? "opacity-60 cursor-not-allowed" : "hover:opacity-95"}`}
              >
                {paymentTab === "COD" ? (
                  <>
                    PLACE ORDER : ₹{finalTotal.toFixed(2)}{" "}
                    {discount > 0 && <span className="line-through text-sm text-white/60 ml-3">₹{subtotal.toFixed(2)}</span>}
                  </>
                ) : paymentValid ? (
                  <>
                    PAY &amp; PLACE ORDER : ₹{onlinePayable.toFixed(2)}{" "}
                    {discount > 0 && <span className="line-through text-sm text-white/60 ml-3">₹{subtotal.toFixed(2)}</span>}
                  </>
                ) : (
                  // disabled state text (matches screenshot style)
                  <>Please complete payment details</>
                )}
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
              src="/assets/Images/order-success.png"
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
