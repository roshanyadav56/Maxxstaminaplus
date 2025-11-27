"use client";

import { useState } from "react";
import { users } from "../components/DummyDB";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  function handleSignup() {
    if (!name || !email || !pass) {
      return alert("Please fill all fields");
    }

    const exists = users.find((u) => u.email === email);
    if (exists) return alert("User already exists");

    users.push({
      id: Date.now(),
      name,
      email,
      password: pass,
    });

    alert("Account Created (dummy)");
    router.push("/login");
  }

  function handleGoogleSignup() {
    alert("Google Signup Coming Soon ✅");
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
          <h1 className="text-3xl font-bold mb-2">Create an account</h1>
          <p className="text-gray-500 mb-6">Enter your details below</p>

          {/* NAME */}
          <label className="text-sm text-[var(--primary-color)] mb-1">Full Name</label>
          <input
            className="border-b mb-6 pb-2 w-full outline-none"
            onChange={(e) => setName(e.target.value)}
          />

          {/* EMAIL */}
          <label className="text-sm text-[var(--primary-color)] mb-1">Email or Phone Number</label>
          <input
            className="border-b mb-6 pb-2 w-full outline-none"
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* PASSWORD — ✅ NO EYE BUTTON */}
          <label className="text-sm text-[var(--primary-color)] mb-1">Password</label>
          <input
            type="password"
            className="border-b mb-6 pb-2 w-full outline-none"
            onChange={(e) => setPass(e.target.value)}
          />

          {/* SIGNUP BUTTON */}
          <button
            className="bg-[var(--primary-color)] text-white py-3 rounded-md mb-4"
            onClick={handleSignup}
          >
            Create Account
          </button>

          {/* GOOGLE SIGNUP BUTTON */}
          <button
            onClick={handleGoogleSignup}
            className="flex items-center justify-center gap-3 border py-3 rounded-md mb-6"
          >
            <FcGoogle size={22} />
            <span className="text-sm font-medium">Sign up with Google</span>
          </button>

          {/* LOGIN LINK */}
          <p className="mt-4 text-sm">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/login")}
              className="text-[var(--primary-color)] underline"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}
