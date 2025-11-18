"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiMail, FiChevronRight } from "react-icons/fi";
import { FaTwitter, FaFacebookF, FaInstagram, FaGithub } from "react-icons/fa";

export default function FooterNewsletter() {
    return (
        <>
            <section className="py-12 bg-[#f1f5f9] "></section>
            <footer className=" relative">
                <section className="relative mx-auto px-6 relative bg-[var(--primary-color)]/20">
                    {/* Newsletter banner */}
                    <div className="max-w-7xl relative mx-auto text-[var(--light-color)] rounded-xl w-full -top-20 p-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-[var(--primary-color)]">
                        <h2 className="text-lg md:text-4xl font-extrabold leading-tight uppercase tracking-wide">
                            Stay upto date about
                            <br />
                            our latest products
                        </h2>

                        <form
                            className="flex items-center bg-[var(--light-color)] rounded-full overflow-hidden max-w-md w-full md:w-auto relative"
                            onSubmit={(e) => e.preventDefault()}
                            aria-label="Subscribe to newsletter"
                        >
                            <label htmlFor="email" className="sr-only">
                                Enter your email address
                            </label>

                            <div className="flex items-center px-4">
                                <FiMail className="text-[var(--primary-color)]" size={18} />
                            </div>

                            <input
                                id="email"
                                type="email"
                                placeholder="Enter your email address"
                                className="px-4 py-3 outline-none w-full text-[var(--dark-color)]"
                                required
                            />

                            <button
                                type="submit"
                                className="px-5 py-3 me-1 text-[var(--light-color)] rounded-r-full flex items-center transition-opacity hover:opacity-90 bg-[var(--primary-color)]"
                                aria-label="Subscribe"
                            >
                                <FiChevronRight />
                            </button>
                        </form>
                    </div>

                    {/* Main footer content */}
                    <div className="max-w-7xl relative mx-auto ">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {/* Left column: logo + description + social */}
                            <div>
                                <div className="flex items-center">
                                    <div className="footerbx">
                                        {/* simple logo mark */}
                                        <div className="rounded-full flex items-center justify-center">
                                            <Image
                                                src="/assets/logo.png"
                                                alt="MaxxStaminaPlus"
                                                width={100}
                                                height={40}
                                                className="object-contain"
                                                priority
                                            />
                                        </div>
                                        <div className="text-2xl font-extrabold text-[var(--primary-color)]">MaxxStaminaPlus<span className="text-[var(--primary-color)]">+</span></div>

                                    </div>
                                </div>

                                <p className="mt-4 text-sm max-w-xs text-[var(--dark-color)]">
                                    We have clothes that suits your style and which you're proud to wear. From women to men.
                                </p>

                                <div className="flex items-center gap-3 mt-4">
                                    <button className="p-2 rounded-full text-[var(--primary-color)] border shadow-sm hover:shadow"> <FaTwitter /> </button>
                                    <button className="p-2 rounded-full text-[var(--light-color)] shadow-sm hover:shadow bg-[var(--primary-color)]"> <FaFacebookF /> </button>
                                    <button className="p-2 rounded-full text-[var(--primary-color)] border shadow-sm hover:shadow"> <FaInstagram /> </button>
                                    <button className="p-2 rounded-full text-[var(--primary-color)] border shadow-sm hover:shadow"> <FaGithub /> </button>
                                </div>
                            </div>

                            {/* Columns: Company, Help, FAQ */}
                            <div className="md:col-span-3 grid grid-cols-3 gap-6">
                                <div>
                                    <h3 className="font-semibold tracking-wider text-[var(--primary-color)]">Company</h3>
                                    <ul className="mt-4 space-y-3 text-sm text-[var(--dark-color)]">
                                        <li><Link href="/about">About</Link></li>
                                        <li><Link href="">Features</Link></li>
                                        <li><Link href="">Works</Link></li>
                                        <li><Link href="">Career</Link></li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-semibold tracking-wider text-[var(--primary-color)]">Help</h3>
                                    <ul className="mt-4 space-y-3 text-sm text-[var(--dark-color)]">
                                        <li><Link href="">Customer Support</Link></li>
                                        <li><Link href="">Delivery Details</Link></li>
                                        <li><Link href="">Terms & Conditions</Link></li>
                                        <li><Link href="">Privacy Policy</Link></li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-semibold tracking-wider text-[var(--primary-color)]">FAQ</h3>
                                    <ul className="mt-4 space-y-3 text-sm text-[var(--dark-color)]">
                                        <li><Link href="">Account</Link></li>
                                        <li><Link href="">Manage Deliveries</Link></li>
                                        <li><Link href="">Orders</Link></li>
                                        <li><Link href="">Payments</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-[var(--text-muted)] mt-10 pt-6 flex flex-col md:flex-row items-center justify-between pb-6">
                            <div className="text-sm text-[var(--text-muted)]">
                                <strong className="text-[var(--dark-color)]">MAXXSTAMINAPLUS+</strong> © 2025 All Rights Reserved
                            </div>

                            <div className="mt-4 md:mt-0 flex items-center gap-4">

                                {/* payment icons as pills */}
                                <div className="flex items-center gap-2 ml-4">
                                    <Image src="/assets/Images/visa.png" alt="Visa" width={52} height={32} className="object-contain" />
                                    <Image src="/assets/Images/gpay.png" alt="Gpay" width={52} height={32} className="object-contain" />
                                    <Image src="/assets/Images/mastercard.png" alt="MasterCard" width={52} height={32} className="object-contain" />
                                    <Image src="/assets/Images/paypal.png" alt="PayPal" width={52} height={32} className="object-contain" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </footer>
        </>
    );
}
