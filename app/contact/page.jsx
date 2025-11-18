"use client";

import Image from "next/image";
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import { FaInstagram, FaTwitter, FaDiscord } from "react-icons/fa";

export default function Contact() {
  return (
    <>
      <section
        className="
              relative
              min-h-[60vh] md:min-h-[70vh] w-full flex items-center
              overflow-hidden
              before:content-[''] before:absolute before:inset-0 before:bg-[var(--dark-color)] before:opacity-70
              before:z-0
            bg-[var(--primary-color)] text-[var(--light-color)]"
      >
        {/* CONTENT */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-8">

            {/* LEFT TEXT */}
            <div className="md:col-span-6 lg:col-span-5">
              <div className="max-w-xl">
                <p className="text-base mb-4 text-[var(--light-color)]">
                  <span className="font-semibold">MaxxStaminaPlus+</span>
                  <span className="mx-2">•</span>
                  <span className="text-[var(--primary-color)] font-bold">Contact</span>
                </p>

                <h1
                  className="font-extrabold leading-none tracking-tight -mt-2 text-[var(--light-color)]"
                  style={{
                    fontSize: "clamp(3.5rem, 9vw, 7.5rem)",
                    lineHeight: 0.9,
                  }}
                >
                  Contact
                </h1>
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="md:col-span-6 lg:col-span-7 flex justify-center md:justify-end">
              <div className="
                      relative
                      w-64 sm:w-80 md:w-[420px] lg:w-[520px]
                      before:content-[''] before:absolute before:inset-0
                      before:-z-10 before:rounded-2xl before:scale-110
                      before:blur-2xl before:opacity-60
                      before:bg-[var(--accent-color)]
                    "
              >
                <Image
                  src="/assets/Images/ShilajitGoldResin.png"
                  alt="MaxxStaminaPlus product"
                  width={740}
                  height={420}
                  className="object-contain relative z-10 rounded-xl"
                  priority
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CONTACT FORM SECTION */}
      <section className="w-full flex justify-center py-10 px-4">
        <div className="max-w-7xl w-full bg-white shadow-2xl rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

          {/* LEFT SIDE */}
          <div className="bg-[#A01717] text-white p-10 rounded-l-2xl relative">
            <h2 className="text-3xl font-bold mb-3">Contact Information</h2>
            <p className="text-white/80 mb-10">Say something to start a live chat!</p>

            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 bg-white/20 rounded-full">
                <FiPhone size={20} />
              </div>
              <span className="font-medium">+1012 3456 789</span>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 bg-white/20 rounded-full">
                <FiMail size={20} />
              </div>
              <span className="font-medium">demo@gmail.com</span>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 bg-white/20 rounded-full">
                <FiMapPin size={20} />
              </div>
              <span className="font-medium">
                132 Dartmouth Street Boston,<br />
                Massachusetts 02156 United States
              </span>
            </div>

            <div className="flex gap-5 absolute bottom-10 left-10">
              <FaInstagram size={22} className="cursor-pointer hover:scale-110 transition" />
              <FaTwitter size={22} className="cursor-pointer hover:scale-110 transition" />
              <FaDiscord size={22} className="cursor-pointer hover:scale-110 transition" />
            </div>
          </div>

          {/* RIGHT SIDE (FORM) */}
          <div className="p-10">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>

              {/* First + Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-[#A01717]">First Name</label>
                  <input
                    type="text"
                    required
                    className="w-full border-b border-gray-400 text-[var(--dark-color)] focus:border-[#A01717] focus:outline-none py-2"
                    placeholder="John"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-[#A01717]">Last Name</label>
                  <input
                    type="text"
                    required
                    className="w-full border-b border-gray-400 text-[var(--dark-color)] focus:border-[#A01717] focus:outline-none py-2"
                    placeholder="Doe"
                  />
                </div>
              </div>

              {/* Email + Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-[#A01717]">Email</label>
                  <input
                    type="email"
                    required
                    className="w-full border-b border-gray-400 text-[var(--dark-color)] focus:border-[#A01717] focus:outline-none py-2"
                    placeholder="demo@gmail.com"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-[#A01717]">Phone Number</label>
                  <input
                    type="text"
                    required
                    pattern="[0-9+\s]+"
                    className="w-full border-b border-gray-400 text-[var(--dark-color)] focus:border-[#A01717] focus:outline-none py-2"
                    placeholder="+1 012 3456 789"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="text-sm font-semibold text-[#A01717]">Message</label>
                <textarea
                  placeholder="Write your message.."
                  rows={3}
                  required
                  className="w-full border-b border-gray-400 text-[var(--dark-color)] focus:border-[#A01717] focus:outline-none py-2"
                ></textarea>
              </div>

              {/* Send Button */}
              <div className="pt-4 flex justify-center">
                <button
                  type="submit"
                  className="bg-[#A01717] text-white px-8 py-3 font-semibold rounded-lg hover:bg-[#8c1414] transition"
                >
                  Send Message
                </button>
              </div>

            </form>
          </div>
        </div>
      </section>

      <section className="w-full flex justify-center py-10 px-4">
        <div className="max-w-7xl w-full rounded-2xl overflow-hidden shadow-xl border">

          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3558.783597660691!2d75.7919067752703!3d26.878615676667618!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db5107c787f79%3A0x9c3b124c7266653b!2sALICE%20NUTRITION!5e0!3m2!1sen!2sin!4v1763027990670!5m2!1sen!2sin"
            width="100%"
            height="500"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>

          

        </div>
      </section>
    </>
  );
}
