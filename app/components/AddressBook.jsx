"use client";

import { useEffect, useState } from "react";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { MdAdd, MdDelete } from "react-icons/md";

export default function AddressBook() {
    const [addresses, setAddresses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        altPhone: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
        address: "",
        tag: "HOME",
    });
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [openMenu, setOpenMenu] = useState(null);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("userAddresses")) || [];
        setAddresses(saved);

        const savedIndexRaw = localStorage.getItem("selectedAddressIndex");
        const savedIndex =
            savedIndexRaw !== null && !isNaN(Number(savedIndexRaw))
                ? Number(savedIndexRaw)
                : null;

        if (savedIndex !== null && saved[savedIndex]) {
            setSelectedAddress(savedIndex);
        } else if (saved.length > 0) {
            setSelectedAddress(0);
            localStorage.setItem("selectedAddressIndex", "0");
        }
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const toggleMenu = (i) => {
        setOpenMenu(openMenu === i ? null : i);
    };

    const saveAddress = (e) => {
        e.preventDefault();

        const newAddr = {
            tag: form.tag,
            name: `${form.firstName} ${form.lastName}`.trim(),
            phone: form.phone,
            address: `${form.address}, ${form.city}, ${form.state}, ${form.country} - ${form.pincode}`,
        };

        const updated = [...addresses, newAddr];
        setAddresses(updated);
        localStorage.setItem("userAddresses", JSON.stringify(updated));

        setShowForm(false);
        setForm({
            firstName: "",
            lastName: "",
            phone: "",
            altPhone: "",
            city: "",
            state: "",
            country: "",
            pincode: "",
            address: "",
            tag: "HOME",
        });

        const newIndex = updated.length - 1;
        setSelectedAddress(newIndex);
        localStorage.setItem("selectedAddressIndex", String(newIndex));
    };

    const deleteAddress = (i) => {
        const updated = addresses.filter((_, index) => index !== i);
        setAddresses(updated);
        localStorage.setItem("userAddresses", JSON.stringify(updated));
        setOpenMenu(null);

        if (selectedAddress === null) return;

        if (i === selectedAddress) {
            if (updated.length === 0) {
                setSelectedAddress(null);
                localStorage.removeItem("selectedAddressIndex");
            } else {
                const newIndex = 0;
                setSelectedAddress(newIndex);
                localStorage.setItem("selectedAddressIndex", String(newIndex));
            }
        } else if (i < selectedAddress) {
            const newIndex = selectedAddress - 1;
            setSelectedAddress(newIndex);
            localStorage.setItem("selectedAddressIndex", String(newIndex));
        }
    };

    const handleSelectAddress = (i) => {
        setSelectedAddress(i);
        localStorage.setItem("selectedAddressIndex", String(i));
    };

    const useCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    const { latitude, longitude } = pos.coords;
                    try {
                        const res = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
                        );
                        const data = await res.json();
                        setForm((prev) => ({
                            ...prev,
                            city: data.address.city || data.address.town || data.address.village || "",
                            state: data.address.state || "",
                            country: data.address.country || "",
                            pincode: data.address.postcode || "",
                            address: data.address.road
                                ? `${data.address.road}, ${data.address.neighbourhood || ""}`
                                : "",
                        }));
                    } catch (err) {
                        console.error(err);
                    }
                },
                (err) => alert("Unable to get location: " + err.message)
            );
        } else {
            alert("Geolocation is not supported.");
        }
    };

    return (
        <div className="max-w-4xl bg-[var(--light-color)] rounded-lg shadow mx-auto px-4 sm:px-6 lg:px-10 py-10">
            <h1 className="text-3xl font-bold mb-8 text-[var(--dark-color)]">
                Address Book
            </h1>

            {!showForm && (
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-3 w-full px-6 py-4 border rounded-xl text-[var(--primary-color)] border-[var(--primary-color)] font-semibold text-lg"
                >
                    <span className="text-2xl">
                        <MdAdd />
                    </span>
                    ADD A NEW ADDRESS
                </button>
            )}

            {!showForm &&
                addresses.map((addr, i) => (
                    <div
                        key={i}
                        className={`relative border ${selectedAddress === i
                                ? "ring-2 ring-[var(--primary-color)]"
                                : "border-[#c9c9c9]"
                            } rounded-xl p-5 mt-5 bg-[var(--light-color)] shadow-sm`}
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
                                    onClick={() => deleteAddress(i)}
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

            {showForm && (
                <>
                    {/* Form Header */}
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

                    {/* Form */}
                    <form
                        onSubmit={saveAddress} // ✅ Fixed function name
                        className="bg-[var(--light-color)] border border-[var(--bg-muted)] border-t-0 rounded-b-2xl shadow-sm px-4 sm:px-10 py-8 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6"
                    >
                        {/* FIRST NAME */}
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-[var(--primary-color)] mb-2">
                                First Name
                            </label>
                            <input
                                name="firstName"
                                value={form.firstName} // ✅ fixed state reference
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
                                value={form.lastName} // ✅ fixed state reference
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
                                value={form.phone}
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
                                value={form.altPhone}
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
                                value={form.city}
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
                                value={form.pincode}
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
                                value={form.state}
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
                                value={form.country}
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
                                value={form.address}
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
    );
}
