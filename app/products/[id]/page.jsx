"use client";
import { useRouter } from "next/navigation";
import { use } from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiHeart, FiShare2 } from "react-icons/fi";
import { AiFillHeart } from "react-icons/ai";
import CouponAndDeliveryBox from "../../components/CouponAndDeliveryBox";
import ProductBenefits from "../../components/ProductBenefits";
import BenefitsSlider from "../../components/BenefitsSlider";
import StepbyStep from "../../components/StepbyStep";
import ReviewList from "../../components/ReviewList";

export default function ProductDetails({ params }) {

  const router = useRouter();
  const { id } = use(params);

  const allProducts = [
    {
      id: 1,
      name: "SHILAJIT GOLD (15ml Pack)",
      images: [
        "/assets/images/ShilajitGold.png",
        "/assets/images/ShilajitGold.png",
        "/assets/images/ShilajitGold.png",
      ],
      currentPrice: 459,
      oldPrice: 699,
      discountPercent: 34,
      saveAmount: 240,
      description:
        "Premium Shilajit Gold Resin for enhanced stamina, strength and energy. 100% pure Himalayan extract.",
    },

    {
      id: 2,
      name: "SHILAJIT GOLD RESIN",
      images: [
        "/assets/images/ShilajitGoldResin.png",
        "/assets/images/ShilajitGoldResin.png",
        "/assets/images/ShilajitGoldResin.png",
      ],
      currentPrice: 459,
      oldPrice: 699,
      discountPercent: 34,
      saveAmount: 240,
      description:
        "Authentic Shilajit Gold Resin with rich minerals to boost performance and reduce fatigue.",
    },

    {
      id: 3,
      name: "Extra Shot + (40 CAPSULES)",
      images: [
        "/assets/images/ExtraShot.png",
        "/assets/images/ExtraShot.png",
        "/assets/images/ExtraShot.png",
      ],
      currentPrice: 499,
      oldPrice: 699,
      discountPercent: 28,
      saveAmount: 200,
      description:
        "Extra Shot+ capsules designed to boost energy levels, immunity, and overall vitality.",
    },

    {
      id: 4,
      name: "SEXUAL WELLNESS SUPPLEMENT (60 CAPSULES)",
      images: [
        "/assets/images/SexualWellness.png",
        "/assets/images/SexualWellness.png",
        "/assets/images/SexualWellness.png",
      ],
      image: "/assets/images/SexualWellness.png",
      currentPrice: 499,
      oldPrice: 699,
      discountPercent: 28,
      saveAmount: 200,
      description:
        "Daily wellness supplement focusing on performance, stamina, and hormonal balance.",
    },
  ];

  const product = allProducts.find((p) => p.id === Number(id));

  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock images for carousel (same image repeated for demo; replace with actual images)
  const productImages = product?.images ?? [];

  useEffect(() => {
    if (!product) return;

    let viewed = JSON.parse(localStorage.getItem("justViewed")) || [];
    viewed = viewed.filter((p) => p.id !== product.id);
    viewed.unshift(product);
    if (viewed.length > 10) viewed = viewed.slice(0, 10);
    localStorage.setItem("justViewed", JSON.stringify(viewed));
  }, [product]);

  useEffect(() => {
    const w = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setIsWishlisted(w.some((p) => p.id === product?.id));
  }, [product]);

  const toggleWishlist = () => {
    if (!product) return;
    let w = JSON.parse(localStorage.getItem("wishlist") || "[]");
    if (w.some((p) => p.id === product.id)) {
      w = w.filter((p) => p.id !== product.id);
    } else {
      w.push(product);
    }
    localStorage.setItem("wishlist", JSON.stringify(w));
    setIsWishlisted(!isWishlisted);
    try { window.dispatchEvent(new Event("localStorageUpdated")); } catch (e) { }
  };

  const addToCart = () => {
    if (!product) return;
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");

    // Check if already in cart, add quantity
    const existing = cart.find((p) => p.id === product.id);
    if (existing) {
      existing.qty = (existing.qty || 1) + quantity;
    } else {
      cart.push({ ...product, qty: quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    // Dispatch localStorage update event (keep it if other components rely on it)
    try {
      window.dispatchEvent(new Event("localStorageUpdated"));
    } catch (e) { }
  };


  if (!product) {
    return (
      <div className="p-10 text-center text-[var(--primary-color)]">
        <h1 className="text-3xl font-bold">Product Not Found</h1>
      </div>
    );
  }
  const shareOnWhatsApp = () => {
    const productName = product.name;
    const productUrl = typeof window !== "undefined" ? window.location.href : "";

    const message = `Check out this product:\n${productName}\n${productUrl}`;

    const whatsappURL = "https://wa.me/?text=" + encodeURIComponent(message);

    window.open(whatsappURL, "_blank");
  };


 const buyNow = () => {
  if (!product) return;

  // CLEAR old buy-now product first
  localStorage.removeItem("checkoutProduct");

  // SAVE only this product
  localStorage.setItem(
    "checkoutProduct",
    JSON.stringify({
      id: product.id,
      name: product.name,
      currentPrice: product.currentPrice,
      qty: quantity,
      image: product.images?.[0],
    })
  );



  router.push("/checkout");
};

  return (
    <>
      <div className="max-w-7xl mx-auto px-8 py-10 bg-[var(--light-color)] rounded-2xl mt-10">

        {/* Breadcrumb */}
        <p className="text-sm text-[var(--dark-color)] mb-6">
          <Link href="/" className="hover:text-[var(--primary-color)]">Home</Link> /
          <Link href="/products" className="ml-1 hover:text-[var(--primary-color)]">Products</Link> /
          <span className="ml-1 text-[var(--primary-color)]">{product.name}</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">

          {/* LEFT: Image Carousel (Fixed) */}
          <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative w-full aspect-square bg-[var(--bg-muted)] rounded-lg overflow-hidden shadow-sm">
              <Image
                src={productImages[currentImageIndex]}
                alt={`${product.name} - Image ${currentImageIndex + 1}`}
                fill
                className="object-contain p-6"
              />

              {/* Left Arrow */}
              <button
                onClick={() => setCurrentImageIndex((currentImageIndex - 1 + productImages.length) % productImages.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-[var(--light-color)] rounded-full p-2 shadow hover:bg-[var(--bg-muted)] transition invisible"
              >
                <span className="text-[var(--primary-color)] text-lg">‹</span>
              </button>

              {/* Right Arrow */}
              <button
                onClick={() => setCurrentImageIndex((currentImageIndex + 1) % productImages.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-[var(--light-color)] rounded-full p-2 shadow hover:bg-[var(--bg-muted)] transition invisible"
              >
                <span className="text-[var(--primary-color)] text-lg">›</span>
              </button>

              {/* Sold & Rating Badge (Top Left) */}
              <div className="absolute top-4 left-4 flex flex-col gap-1">
                <div className="text-xs font-bold bg-[var(--light-color)] rounded-lg px-3 py-2 shadow  text-[var(--primary-color)]">1,238 <span className="text-[var(--dark-color)]">Sold</span></div>
                <div className="text-sm font-semibold bg-[var(--light-color)] rounded-lg px-3 py-2 w-fit shadow text-[var(--dark-color)]"><span className="text-yellow-400">★</span> 4.5</div>
              </div>

              {/* Wishlist & Share (Top Right) */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={toggleWishlist}
                  className={`p-3 rounded-full shadow transition ${isWishlisted ? "bg-[var(--primary-color)]" : "bg-[var(--light-color)]"}`}
                >
                  {isWishlisted ? (
                    <AiFillHeart size={20} className="text-[var(--light-color)]" />
                  ) : (
                    <FiHeart size={20} className="text-[var(--primary-color)]" />
                  )}
                </button>
                <button
                  onClick={shareOnWhatsApp}
                  className="p-3 rounded-full shadow bg-[var(--light-color)] hover:bg-[var(--bg-muted)] transition"
                >
                  <FiShare2 size={20} className="text-[var(--primary-color)]" />
                </button>
              </div>

            </div>

            {/* Thumbnail Carousel */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${idx === currentImageIndex
                    ? "border-[var(--primary-color)] bg-[var(--light-color)]"
                    : "border-[var(--bg-muted)] bg-[var(--bg-muted)]"
                    }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    width={64}
                    height={64}
                    className="object-contain w-full h-full p-1"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Product Info */}
          <div className="sticky top-24 h-fit">
            {/* Brand */}
            <p className="text-xs text-[var(--dark-color)] uppercase tracking-wide mb-2">MaxxstaminaPlus</p>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--dark-color)] mb-4">
              {product.name}
            </h1>

            {/* Price Section */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm md:text-2xl line-through text-[var(--dark-color)]">₹{product.oldPrice}.00</span>
              <span className="text-lg md:text-3xl font-bold text-[var(--primary-color)]">₹{product.currentPrice}.00</span>
              <span className="text-sm md:text-2xl text-[var(--dark-color)] font-semibold">({product.discountPercent}% OFF)</span>
            </div>

            <p className="text-xs text-[var(--dark-color)] mb-6">MRP (incl. all taxes)</p>

            <hr className="my-4" />

            {/* Description */}
            <p className="text-sm text-[var(--dark-color)] leading-relaxed mb-6">
              {product.description}
            </p>




            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <button
                onClick={addToCart}
                className="flex-1 px-6 py-3 bg-[var(--primary-color)] text-[var(--light-color)] rounded-lg font-bold text-base hover:opacity-95 transition"
              >
                Add To Cart
              </button>
              <button
                onClick={buyNow}
                className="flex-1 px-6 py-3 border-2 border-[var(--primary-color)] text-[var(--primary-color)] rounded-lg font-bold text-base hover:bg-[var(--primary-color)] hover:text-[var(--light-color)] transition"
              >
                Buy Now
              </button>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="text-sm font-bold text-[var(--dark-color)] block mb-3">Quantity</label>
              <div className="flex items-center w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 bg-[var(--primary-color)] text-[var(--light-color)] rounded-l flex items-center justify-center font-bold text-lg"
                >
                  −
                </button>
                <input
                  type="text"
                  value={String(quantity).padStart(2, "0")}
                  readOnly
                  className="w-14 h-10 text-center border border-[var(--bg-muted)] py-1 text-[var(--dark-color)] font-bold text-lg"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 bg-[var(--primary-color)] text-[var(--light-color)] rounded-r flex items-center justify-center font-bold text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* Offers Section */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-[var(--dark-color)] mb-3">Offers For You · 2 available offers</h3>

              <div className="space-y-2 text-sm">
                <p className="text-[var(--dark-color)]">
                  <span className="font-semibold">Coupon Offers: </span>
                  <span className="text-[var(--dark-color)]">Use code MAXX5 to get a flat 5% on your 1st order.</span>
                </p>

                <p className="text-[var(--dark-color)]">
                  <span className="font-semibold">Coupon Offers: </span>
                  <span className="text-[var(--dark-color)]">Use code OFFER5 to get a flat 5% off on cart.</span>
                </p>
              </div>
            </div>

            <CouponAndDeliveryBox productId={product.id} />

          </div>
        </div>

        <div className=" max-w-7xl mx-auto px-8 py-10 bg-[var(--light-color)] rounded-2xl">
          <ProductBenefits />
        </div>

        <div className=" max-w-7xl mx-auto px-8 py-10 bg-[var(--light-color)] rounded-2xl">
          <BenefitsSlider />
        </div>

        <div className=" max-w-7xl mx-auto px-8 py-10 bg-[var(--light-color)] rounded-2xl">
          <StepbyStep />
        </div>


      </div>
      <div className=" max-w-7xl mx-auto px-8 py-10 rounded-2xl">
        <ReviewList />
      </div>
    </>
  );
}
