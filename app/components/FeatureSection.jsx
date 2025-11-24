"use client";
import { FaShieldAlt, FaStar, FaTruck, FaBox } from 'react-icons/fa'; // Import specific icons from React Icons

const FeatureSection = () => {
    return (
        <div className="w-full py-2 sm:py-8">
            <div className="max-w-7xl mx-3 md:mx-auto p-4 sm:px-6 lg:px-8 bg-[var(--light-color)] rounded-xl shadow-sm relative">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {/* Feature Item 1 */}
                    <div className="flex flex-row items-center">
                        <div className="w-10 h-10 p-3 md:w-16 md:h-16 rounded-full bg-[var(--primary-color)]/20 flex items-center justify-center">
                            <FaShieldAlt className="w-8 h-8 text-[var(--primary-color)]" /> {/* Icon for "100% Original" */}
                        </div>
                        <p className="text-base md:text-lg font-medium ms-2 text-[var(--dark-color)]">100% Original</p>
                    </div>

                    {/* Feature Item 2 */}
                    <div className="flex flex-row items-center">
                        <div className="w-10 h-10 p-3 md:w-16 md:h-16 rounded-full bg-[var(--primary-color)]/20 flex items-center justify-center">
                            <FaStar className="w-8 h-8 text-[var(--primary-color)]" /> {/* Icon for "Certified by Brands" */}
                        </div>
                        <p className="text-base md:text-lg font-medium ms-2 text-[var(--dark-color)]">Certified by Brands</p>
                    </div>

                    {/* Feature Item 3 */}
                    <div className="flex flex-row items-center">
                        <div className="w-10 h-10 p-3 md:w-16 md:h-16 rounded-full bg-[var(--primary-color)]/20 flex items-center justify-center">
                            <FaTruck className="w-8 h-8 text-[var(--primary-color)]" /> {/* Icon for "Direct Sourcing" */}
                        </div>
                        <p className="text-base md:text-lg font-medium ms-2 text-[var(--dark-color)]">Direct Sourcing</p>
                    </div>

                    {/* Feature Item 4 */}
                    <div className="flex flex-row items-center">
                        <div className="w-10 h-10 p-3 md:w-16 md:h-16 rounded-full bg-[var(--primary-color)]/20 flex items-center justify-center">
                            <FaBox className="w-8 h-8 text-[var(--primary-color)]" /> {/* Icon for "Secure Packaging" */}
                        </div>
                        <p className="text-base md:text-lg font-medium ms-2 text-[var(--dark-color)]">Secure Packaging</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeatureSection;
