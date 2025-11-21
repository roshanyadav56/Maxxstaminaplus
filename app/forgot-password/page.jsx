"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const router = useRouter();

    function handleSubmit() {
        if (!email) return alert("Enter email!");
        alert("Reset link sent (dummy)");
        router.push("/login");
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
                    <h1 className="text-3xl font-bold mb-2">Forgot password</h1>
                    <p className="text-gray-500 mb-4">
                        Enter your email for verification process, we will send a link to your email.
                    </p>

                    <label className="text-sm text-[var(--primary-color)] mb-1">Enter Email Address</label>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border-b mb-6 pb-2 w-full outline-none"
                    />

                    <button className="bg-[var(--primary-color)] text-white py-3 rounded-md mb-4" onClick={handleSubmit}>
                        Submit
                    </button>

                    <p className="text-sm">
                        Back to{" "}
                        <button className="text-[var(--primary-color)]" onClick={() => router.push("/login")}>
                            Login
                        </button>
                    </p>
                </div>
            </div>
        </section>
    );
}
