"use client";

import { useEffect, useState } from "react";
import { profile, orders, users } from "../components/DummyDB";
import { useRouter } from "next/navigation";
import AddressBook from "../components/AddressBook";

export default function AccountPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [userOrders, setUserOrders] = useState([]);

  // MAIN PROFILE STATE
  const [profileData, setProfileData] = useState({ ...profile });

  // TEMP STATE FOR EDITING
  const [tempProfile, setTempProfile] = useState({ ...profile });

  // PASSWORD STATES
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ✅ REVIEW STATES
  const [showReviewBox, setShowReviewBox] = useState(false);
  const [selectedReviewItem, setSelectedReviewItem] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [thankYou, setThankYou] = useState(false);

  // RESPONSIVE CHECK
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth < 768);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  // ✅ CHECK LOGIN
  useEffect(() => {
    const id = localStorage.getItem("loggedInUser");
    if (!id) router.push("/login");

    const storedOrders = JSON.parse(localStorage.getItem("orderHistory") || "[]");
    setUserOrders(storedOrders);
  }, [router]);


  // ✅ ✅ LOGOUT (FULL RESET FLOW)
  function logout() {
    // ✅ REMOVE LOGIN
    localStorage.removeItem("loggedInUser");

    // ✅ CLEAR GUEST SHOPPING DATA
    localStorage.removeItem("cart");
    localStorage.removeItem("wishlist");
    localStorage.removeItem("justViewed");
    localStorage.removeItem("appliedCoupon");
    localStorage.removeItem("checkoutProduct");

    // ✅ ORDER HISTORY NOT REMOVED

    // ✅ REFRESH HEADER COUNTS
    try { window.dispatchEvent(new Event("localStorageUpdated")); } catch (e) {}

    router.push("/login");
  }


  // PASSWORD VALIDATION + UPDATE
  function validatePassword() {
    const userId = localStorage.getItem("loggedInUser");
    const currentUser = users.find((u) => u.id == userId);

    if (!currentUser) return alert("User not found!");
    if (oldPassword !== currentUser.password)
      return alert("Current password is incorrect!");
    if (newPassword.trim().length < 6)
      return alert("New password must be at least 6 characters!");
    if (newPassword === oldPassword)
      return alert("New password cannot be same!");
    if (newPassword !== confirmPassword)
      return alert("New & Confirm password do not match!");

    currentUser.password = newPassword;

    alert("Password Updated Successfully!");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* SIDEBAR */}
        <aside className="bg-[var(--light-color)] rounded-xl shadow p-6 text-[var(--dark-color)] h-fit">
          <h2 className="text-xl font-semibold mb-4">Manage My Account</h2>

          <ul className="space-y-4">
            <li
              onClick={() => setActiveTab("profile")}
              className={`cursor-pointer ${activeTab === "profile" ? "text-[var(--primary-color)] font-semibold" : ""}`}
            >
              My Profile
            </li>

            <li
              onClick={() => setActiveTab("address")}
              className={`cursor-pointer ${activeTab === "address" ? "text-[var(--primary-color)] font-semibold" : ""}`}
            >
              Address Book
            </li>

            <li
              onClick={() => setActiveTab("orders")}
              className={`cursor-pointer ${activeTab === "orders" ? "text-[var(--primary-color)] font-semibold" : ""}`}
            >
              My Orders
            </li>

            <li onClick={() => router.push("/wishlist")} className="cursor-pointer">
              Wishlist 
            </li>

            <li
              onClick={() => setActiveTab("password")}
              className={`cursor-pointer ${activeTab === "password" ? "text-[var(--primary-color)] font-semibold" : ""}`}
            >
              Change Password
            </li>
          </ul>

          <button
            onClick={logout}
            className="bg-[var(--primary-color)] w-full text-white mt-6 py-2 rounded-lg"
          >
            Log Out
          </button>
        </aside>

        {/* RIGHT SIDE */}
        <main className="md:col-span-3 rounded-xl text-[var(--dark-color)]">

          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="p-6 bg-[var(--light-color)] rounded-xl shadow">
              <h1 className="text-3xl font-bold mb-6">Edit Your Profile</h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">First Name</label>
                  <input
                    value={tempProfile.firstName}
                    onChange={(e) => setTempProfile({ ...tempProfile, firstName: e.target.value })}
                    className="w-full border-b border-[var(--bg-muted)] pb-2 outline-none focus:border-[var(--primary-color)]"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Last Name</label>
                  <input
                    value={tempProfile.lastName}
                    onChange={(e) => setTempProfile({ ...tempProfile, lastName: e.target.value })}
                    className="w-full border-b border-[var(--bg-muted)] pb-2 outline-none focus:border-[var(--primary-color)]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-sm font-medium mb-2 block">Email Address</label>
                  <input
                    value={tempProfile.email}
                    onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                    className="w-full border-b border-[var(--bg-muted)] pb-2 outline-none focus:border-[var(--primary-color)]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-sm font-medium mb-2 block">Street Address</label>
                  <input
                    value={tempProfile.address}
                    onChange={(e) => setTempProfile({ ...tempProfile, address: e.target.value })}
                    className="w-full border-b border-[var(--bg-muted)] pb-2 outline-none focus:border-[var(--primary-color)]"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-10">
                <button
                  onClick={() => setTempProfile({ ...profileData })}
                  className="px-6 py-2 rounded-lg border border-[var(--primary-color)] text-[var(--primary-color)]"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    setProfileData({ ...tempProfile });
                    profile.firstName = tempProfile.firstName;
                    profile.lastName = tempProfile.lastName;
                    profile.email = tempProfile.email;
                    profile.address = tempProfile.address;
                    alert("Profile Updated Successfully!");
                  }}
                  className="px-6 py-2 rounded-lg bg-[var(--primary-color)] text-white"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* ADDRESS TAB */}
          {activeTab === "address" && <AddressBook />}

          {/* ORDERS TAB */}
          {activeTab === "orders" && (
            <>
              {(userOrders.length ? userOrders : orders).map((o, idx) => {
                const status = idx === 0 ? "delivered" : (o.status || "pending");
                const orderId = o.orderId || o.id;
                const previewItem = o.items?.[0];
                const imageSrc = o.img || previewItem?.img || "/assets/Images/ShilajitGold.png";
                const date = o.orderDate || o.date || "—";

                return (
                  <div
                    key={`${orderId}-${idx}`}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[var(--light-color)] p-4 rounded-xl shadow mb-4"
                  >
                    {/* LEFT CONTENT */}
                    <div className="flex items-center gap-4">
                      <img src={imageSrc} className="w-16 h-16 rounded object-cover" />
                      <div>
                        <h2 className="font-semibold text-lg">{previewItem?.title || "Order"}</h2>
                        <p className="text-sm text-[var(--text-muted)]">Order ID: {orderId}</p>
                        <p className="text-xs text-gray-500">Placed on: {date}</p>

                        {/* ✅ MOBILE REVIEW SECTION */}
                        {isMobile && status === "delivered" && (
                          <div className="mt-2 w-full">
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span key={star} className="text-yellow-500 text-lg">★</span>
                              ))}
                            </div>

                            <button
                              onClick={() => {
                                setSelectedReviewItem(orderId);
                                setShowReviewBox(true);
                              }}
                              className="mt-1 text-sm text-[var(--primary-color)] font-medium underline"
                            >
                              Write a Review
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="flex flex-col md:items-end gap-2">
                      <span className="inline-flex items-center gap-1 text-sm capitalize">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            status === "delivered"
                              ? "bg-green-500"
                              : status === "cancelled"
                              ? "bg-red-500"
                              : "bg-yellow-400"
                          }`}
                        />
                        {status}
                      </span>

                      {/* ✅ TRACK ORDER ONLY IF NOT DELIVERED/CANCELLED */}
                      {status !== "delivered" && status !== "cancelled" && (
                        <button
                          onClick={() => router.push(`/order/${orderId}`)}
                          className="px-4 py-2 rounded-lg border border-[var(--primary-color)] text-[var(--primary-color)] font-medium hover:bg-[var(--primary-color)] hover:text-[var(--light-color)] transition text-sm"
                        >
                          Track Order
                        </button>
                      )}

                      {/* ✅ DESKTOP REVIEW SECTION */}
                      {!isMobile && status === "delivered" && (
                        <div className="mt-1 flex flex-col md:items-end">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span key={star} className="text-yellow-500 text-lg">★</span>
                            ))}
                          </div>

                          <button
                            onClick={() => {
                              setSelectedReviewItem(orderId);
                              setShowReviewBox(true);
                            }}
                            className="mt-1 text-sm text-[var(--primary-color)] font-medium underline"
                          >
                            Write a Review
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {/* PASSWORD TAB */}
          {activeTab === "password" && (
            <div className="bg-[var(--light-color)] p-8 rounded-xl shadow">
              <h1 className="text-3xl font-bold mb-8">Change Password</h1>

              <label className="text-[var(--primary-color)] font-medium mb-2 block">
                Current Password*
              </label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full border-b border-gray-400 pb-2 mb-8 outline-none text-lg"
              />

              <label className="text-[var(--primary-color)] font-medium mb-2 block">
                New Password*
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border-b border-gray-400 pb-2 mb-8 outline-none text-lg"
              />

              <label className="text-[var(--primary-color)] font-medium mb-2 block">
                Confirm Password*
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border-b border-gray-400 pb-2 mb-12 outline-none text-lg"
              />

              <div className="flex justify-center gap-6 mt-6">
                <button
                  onClick={() => {
                    setOldPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  className="px-10 py-3 border border-[var(--primary-color)] text-[var(--primary-color)] rounded-lg text-lg"
                >
                  Cancel
                </button>

                <button
                  onClick={validatePassword}
                  className="px-10 py-3 bg-[var(--primary-color)] text-white rounded-lg text-lg"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ✅ REVIEW POPUP */}
      {showReviewBox && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">

            {/* ✅ THANK YOU SCREEN */}
            {thankYou ? (
              <div className="text-center py-10">
                <h2 className="text-xl font-bold text-green-600">Thank You!</h2>
                <p className="text-sm text-[var(--text-muted)] mt-2">
                  Your review has been submitted successfully.
                </p>

                <button
                  onClick={() => setShowReviewBox(false)}
                  className="mt-6 bg-[var(--primary-color)] text-white py-2 px-6 rounded-lg"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                {/* ✅ ADD MEDIA */}
                <h3 className="text-lg font-semibold text-[var(--dark-color)] mb-3">Add Photo or Video</h3>

                {/* ✅ HIDDEN FILE INPUTS */}
                <input
                  id="photoInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => console.log("Selected Photo:", e.target.files[0])}
                />

                <input
                  id="videoInput"
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => console.log("Selected Video:", e.target.files[0])}
                />

                {/* ✅ BUTTONS */}
                <div className="flex gap-3 mb-2">
                  <button
                    className="flex-1 border border-[var(--text-muted)] text-[var(--text-muted)] rounded-lg py-2 flex items-center justify-center gap-2"
                    onClick={() => document.getElementById("photoInput").click()}
                  >
                    📷 Add Photo
                  </button>

                  <button
                    className="flex-1 border border-[var(--text-muted)] text-[var(--text-muted)] rounded-lg py-2 flex items-center justify-center gap-2"
                    onClick={() => document.getElementById("videoInput").click()}
                  >
                    🎥 Add Video
                  </button>
                </div>

                <p className="text-xs text-[var(--text-muted)] mb-4">
                  Upload photos/videos related to the product like Unboxing, Installation, Product Usage, etc.
                </p>

                {/* ✅ WRITE REVIEW */}
                <h3 className="text-sm text-[var(--dark-color)] font-semibold mb-2">Write a Review</h3>

                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="How is the product? What do you like? What do you hate?"
                  className="w-full border text-[var(--text-muted)] rounded-lg p-3 h-28 text-sm"
                />

                {/* ✅ BUTTONS */}
                <div className="mt-6 flex justify-between">
                  <button
                    onClick={() => setShowReviewBox(false)}
                    className="text-gray-500 text-sm"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => {
                      setThankYou(true);
                      setReviewText("");
                    }}
                    className="bg-[var(--primary-color)] text-white py-2 px-5 rounded-lg text-sm"
                  >
                    Skip & Finish
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </section>
  );
}
