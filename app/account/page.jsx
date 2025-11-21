"use client";

import { useEffect, useState } from "react";
import { profile, orders, users } from "../components/DummyDB";
import { useRouter } from "next/navigation";
import AddressBook from "../components/AddressBook";

export default function AccountPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");

  // MAIN PROFILE STATE
  const [profileData, setProfileData] = useState({ ...profile });

  // TEMP STATE FOR EDITING
  const [tempProfile, setTempProfile] = useState({ ...profile });

  // PASSWORD STATES
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ALERT STATES
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // CHECK LOGIN
  useEffect(() => {
    const id = localStorage.getItem("loggedInUser");
    if (!id) router.push("/login");
  }, [router]);

  // LOGOUT
  function logout() {
    localStorage.removeItem("loggedInUser");
    router.push("/login");
  }

  // PASSWORD VALIDATION + UPDATE
  function validatePassword() {
    setError("");
    setSuccess("");

    const userId = localStorage.getItem("loggedInUser");
    const currentUser = users.find((u) => u.id == userId);

    if (!currentUser) {
      setError("User not found!");
      return;
    }

    if (oldPassword !== currentUser.password) {
      setError("Current password is incorrect!");
      return;
    }

    if (newPassword.trim().length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword === oldPassword) {
      setError("New password cannot be the same as old password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password & confirm password do not match.");
      return;
    }

    // UPDATE
    currentUser.password = newPassword;
    setSuccess("Password updated successfully!");

    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* SIDEBAR */}
        <aside className="bg-[var(--light-color)] rounded-xl shadow p-6 text-[var(--dark-color)]">
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

            {/* Redirect to Wishlist Page */}
            <li
              onClick={() => router.push("/wishlist")}
              className={`cursor-pointer ${activeTab === "wishlist" ? "text-[var(--primary-color)] font-semibold" : ""}`}
            >
              My Favourite
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
              {orders.map((o) => (
                <div
                  key={o.id}
                  className="flex items-center justify-between bg-[var(--light-color)] p-4 rounded-xl shadow mb-4"
                >
                  <div className="flex items-center gap-4">
                    <img src={o.img} className="w-16 h-16 rounded object-cover" />

                    <div>
                      <h2 className="font-semibold text-lg">{o.title}</h2>
                      <p className="text-sm text-gray-600">Order ID: {o.orderId}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-lg">₹{o.price}.00</p>
                    ...
                  </div>
                </div>
              ))}

            </>
          )}


          {/* PASSWORD TAB */}
          {activeTab === "password" && (
            <div className="bg-[var(--light-color)] p-8 rounded-xl shadow">

              <h1 className="text-3xl font-bold mb-8">Change Password</h1>

              {error && <p className="text-red-600 mb-4 text-lg">{error}</p>}
              {success && <p className="text-green-600 mb-4 text-lg">{success}</p>}

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
                    setError("");
                    setSuccess("");
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
    </section>
  );
}
