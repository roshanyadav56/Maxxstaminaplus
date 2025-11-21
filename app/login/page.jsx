"use client";

import { useState } from "react";
import { users } from "../components/DummyDB";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const router = useRouter();

    function handleLogin() {
        const found = users.find(
            (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === pass
        );

        if (!found) return alert("Invalid email or password");

        localStorage.setItem("loggedInUser", found.id);
        router.push("/account");
    }

    return (
        <section className="max-w-6xl mx-auto px-4 py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 bg-white shadow rounded-xl overflow-hidden">
                <div className="w-full h-72 md:h-full">
                    <img
                        src="/assets/Images/login-image.jpg"
                        className="w-full h-full object-cover"
                        alt="side"
                    />
                </div>

                <div className="p-8 flex flex-col justify-center text-[var(--dark-color)]">
                    <h1 className="text-3xl font-bold mb-2">Log in to Exclusive</h1>
                    <p className="text-gray-500 mb-6">Enter your details below</p>

                    <input
                        className="border-b mb-6 pb-2 w-full outline-none"
                        placeholder="Email or Phone Number"
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        className="border-b mb-6 pb-2 w-full outline-none"
                        placeholder="Password"
                        type="password"
                        onChange={(e) => setPass(e.target.value)}
                    />

                    <button
                        onClick={handleLogin}
                        className="bg-[var(--primary-color)] text-white py-3 rounded-md mb-4"
                    >
                        Log In
                    </button>

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
