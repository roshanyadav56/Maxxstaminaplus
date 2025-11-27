"use client";

import { useState } from "react";
import { users } from "../components/DummyDB";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();

  function handleLogin() {
    const found = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === pass
    );

    if (!found) return alert("Invalid email or password");

    // ✅ RESET GUEST DATA
    localStorage.removeItem("cart");
    localStorage.removeItem("wishlist");
    localStorage.removeItem("justViewed");
    localStorage.removeItem("appliedCoupon");
    localStorage.removeItem("checkoutProduct");

    // ✅ SAVE LOGGED-IN USER
    localStorage.setItem("loggedInUser", found.id);

    // ✅ REDIRECT
    router.push("/account");
  }

  function handleGoogleLogin() {
    alert("Google Login Coming Soon ✅");
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 bg-white shadow rounded-xl overflow-hidden">
        
        {/* LEFT IMAGE */}
        <div className="w-full h-72 md:h-full">
          <img
            src="/assets/Images/login-image.jpg"
            className="w-full h-full object-cover"
            alt="side"
          />
        </div>

        {/* RIGHT FORM */}
        <div className="p-8 flex flex-col justify-center text-[var(--dark-color)]">
          <h1 className="text-3xl font-bold mb-2">Log in to Exclusive</h1>
          <p className="text-gray-500 mb-6">Enter your details below</p>

          {/* EMAIL */}
          <input
            className="border-b mb-6 pb-2 w-full outline-none"
            placeholder="Email or Phone Number"
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* PASSWORD */}
          <div className="relative mb-6">
            <input
              className="border-b pb-2 w-full outline-none"
              placeholder="Password"
              type={showPass ? "text" : "password"}
              onChange={(e) => setPass(e.target.value)}
            />

            {/* EYE ICON */}
            <span
              onClick={() => setShowPass(!showPass)}
              className="absolute right-2 top-1 cursor-pointer text-gray-500 text-xl"
            >
              {showPass ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          {/* LOGIN BUTTON */}
          <button
            onClick={handleLogin}
            className="bg-[var(--primary-color)] text-white py-3 rounded-md mb-4"
          >
            Log In
          </button>

          {/* GOOGLE LOGIN */}
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-3 border py-3 rounded-md mb-6"
          >
            <FcGoogle size={22} />
            <span className="text-sm font-medium">Login with Google</span>
          </button>

          {/* BOTTOM LINKS */}
          <div className="flex justify-between text-sm">
            <button
              className="text-[var(--primary-color)]"
              onClick={() => router.push("/forgot-password")}
            >
              Forgot Password
            </button>

            <button
              className="border-b border-[var(--primary-color)]"
              onClick={() => router.push("/signup")}
            >
              Create an account?
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
