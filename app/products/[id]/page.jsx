"use client";
import { useRouter } from "next/navigation";
import { use } from "react";
import { useEffect, useState, useRef } from "react";
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

  // zoom states
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);

  // refs for throttling & container rect access
  const zoomRef = useRef(false);
  const zoomContainerRef = useRef(null);

  // 360 states
  const [is360, setIs360] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [dragStartX, setDragStartX] = useState(null);

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
      enable360: true,
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
      enable360: false, // ✔ FIXED HERE
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
      enable360: true,
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
      enable360: false,
      description:
        "Daily wellness supplement focusing on performance, stamina, and hormonal balance.",
    },
  ];


  // TOUCH + MOUSE DRAG (FINAL)
  const startDrag = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setDragStartX(clientX);
  };

  const duringDrag = (e) => {
    if (dragStartX === null) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const diff = clientX - dragStartX;

    setRotation((prev) => prev + diff * 0.4);
    setDragStartX(clientX);
  };

  const stopDrag = () => {
    setDragStartX(null);
  };


  const product = allProducts.find((p) => p.id === Number(id));

  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    if (!product) return;
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const exists = cart.some((p) => p.id === product.id);
    setIsInCart(exists);
  }, [product]);

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

    const existing = cart.find((p) => p.id === product.id);

    if (existing) {
      setIsInCart(true);
      router.push("/cart");
      return;
    }

    cart.push({
      id: product.id,
      name: product.name,
      currentPrice: product.currentPrice,
      oldPrice: product.oldPrice,
      discountPercent: product.discountPercent,
      description: product.description,
      qty: quantity,
      image: product.images[0],     // ⭐ FINAL FIX
    });

    localStorage.setItem("cart", JSON.stringify(cart));
    setIsInCart(true);

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

    // Check Login
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
      // Save target product for after login
      localStorage.setItem("redirectAfterLogin", `/product/${product.id}`);
      alert("Please login to continue checkout");
      router.push("/login");
      return;
    }

    // If logged in → continue Buy Now
    localStorage.removeItem("checkoutProduct");

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

  // total prices
  const totalPrice = product.currentPrice * quantity;
  const totalOldPrice = product.oldPrice * quantity;


  // ------------------------------
  // ZOOM HANDLER (throttled via requestAnimationFrame)
  // ------------------------------
  const handleZoomMove = (e) => {
    // 🔥 TOUCH DEVICES par zoom OFF
    if (e.type === "touchmove") return;

    // 🔥 360 mode ON → Zoom disabled
    if (is360) return;

    // Zoom not active
    if (!isZooming) return;

    // Throttle
    if (zoomRef.current) return;
    zoomRef.current = true;

    requestAnimationFrame(() => {
      if (!zoomContainerRef.current) {
        zoomRef.current = false;
        return;
      }

      const rect = zoomContainerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      const cx = Math.min(100, Math.max(0, x));
      const cy = Math.min(100, Math.max(0, y));

      // ⚡ Prevent unnecessary state updates
      setZoomPosition((prev) => {
        if (prev.x === cx && prev.y === cy) {
          zoomRef.current = false;
          return prev;
        }
        return { x: cx, y: cy };
      });

      zoomRef.current = false;
    });
  };



  return (
    <>
      <div className="max-w-7xl mx-auto px-8 py-10 bg-[var(--light-color)] rounded-2xl mt-10">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">

          {/* LEFT: Image Carousel (Fixed) */}
          <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div
              ref={zoomContainerRef}
              className="relative w-full aspect-square bg-[var(--bg-muted)] rounded-lg shadow-sm overflow-visible"

              /* DESKTOP MOUSE EVENTS */
              onMouseEnter={() => {
                if (!product.enable360) setIsZooming(true);
                if (product.enable360 && !is360) setIsZooming(true);
              }}

              onMouseMove={(e) => {
                // CASE 1: 360 active → drag rotation
                if (product.enable360 && is360) {
                  duringDrag(e);
                  return;
                }

                // CASE 2: 360 allowed but OFF → Zoom
                if (product.enable360 && !is360) {
                  handleZoomMove(e);
                  return;
                }

                // CASE 3: normal product → Zoom
                if (!product.enable360) {
                  handleZoomMove(e);
                  return;
                }
              }}

              onMouseDown={(e) => product.enable360 && is360 && startDrag(e)}
              onMouseUp={stopDrag}
              onMouseLeave={() => {
                stopDrag();
                setIsZooming(false);
              }}

              /* MOBILE TOUCH EVENTS */
              onTouchStart={(e) => product.enable360 && is360 && startDrag(e)}
              onTouchMove={(e) => product.enable360 && is360 && duringDrag(e)}
              onTouchEnd={stopDrag}
            >
              {/* 360 MODE */}
              {product.enable360 && is360 ? (
                <div className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing">
                  <Image
                    src={productImages[currentImageIndex]}
                    alt="360-view"
                    fill
                    draggable={false}
                    className="object-contain p-6 select-none"
                    style={{
                      transform: `rotateY(${rotation}deg)`,
                      transition: dragStartX ? "none" : "transform 0.12s ease-out",
                    }}
                  />
                </div>
              ) : (
                /* Normal / Zoom Image */
                <Image
                  src={productImages[currentImageIndex]}
                  alt={`${product.name} - Image ${currentImageIndex + 1}`}
                  fill
                  className="object-contain p-6"
                />
              )}

              {/* 360 BUTTON */}
              {product.enable360 && (
                <button
                  onClick={() => {
                    setIs360(!is360);
                    setIsZooming(false);
                    zoomRef.current = false;
                    stopDrag();
                    setRotation(0);
                  }}
                  className="absolute bottom-4 left-4 bg-black/60 text-white text-xs px-3 py-1 rounded-lg z-[10]"
                >
                  {is360 ? "Stop 360°" : "View 360°"}
                </button>
              )}

              {/* ZOOM BOX */}
              {!is360 && isZooming && (
                <div
                  className="hidden md:block absolute top-0 left-full ml-10 w-full aspect-square border rounded-lg overflow-hidden shadow-xl bg-white z-[999]"
                >
                  <Image
                    src={productImages[currentImageIndex]}
                    alt="zoomed"
                    fill
                    className="object-cover"
                    style={{
                      transform: `translate(-${zoomPosition.x}%, -${zoomPosition.y}%) scale(2.5)`,
                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    }}
                  />
                </div>
              )}

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

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--dark-color)] mb-4">
              {product.name}
            </h1>

            {/* Price Section */}
            <div className="flex items-center gap-3 mb-0">
              <span className="text-sm md:text-2xl line-through text-[var(--dark-color)]">
                ₹{totalOldPrice}.00
              </span>

              <span className="text-lg md:text-3xl font-bold text-[var(--primary-color)]">
                ₹{totalPrice}.00
              </span>

              <span className="text-sm md:text-2xl text-[var(--dark-color)] font-semibold">
                ({product.discountPercent}% OFF)
              </span>
            </div>


            <p className="text-xs text-[var(--dark-color)] mb-6">MRP (incl. all taxes)</p>
            <div>
              <label className="text-sm font-semibold text-gray-800 mb-2 block">Select Quantity</label>

              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-[120px]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 bg-[var(--bg-muted)] text-[var(--dark-color)] hover:bg-gray-200 transition font-bold text-lg"
                >
                  −
                </button>

                <div className="w-14 h-10 flex items-center justify-center text-gray-800 font-semibold">
                  {String(quantity).padStart(1, "0")}
                </div>

                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 bg-[var(--bg-muted)] text-[var(--dark-color)] hover:bg-gray-200 transition font-bold text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="mt-6 mb-6">
              <h3 className="text-sm font-semibold text-gray-900 ">Product Description</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
            </div>



            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <button
                onClick={() => {
                  if (isInCart) {
                    router.push("/cart");
                  } else {
                    addToCart();
                  }
                }}
                className="flex-1 px-6 py-3 bg-[var(--primary-color)] text-[var(--light-color)] rounded-lg font-bold text-base hover:opacity-95 transition"
              >
                {isInCart ? "Go To Cart" : "Add To Cart"}
              </button>

              <button
                onClick={buyNow}
                className="flex-1 px-6 py-3 border-2 border-[var(--primary-color)] text-[var(--primary-color)] rounded-lg font-bold text-base hover:bg-[var(--primary-color)] hover:text-[var(--light-color)] transition"
              >
                Buy Now
              </button>
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

        <div className=" max-w-7xl mx-auto px-0 sm:px-8 py-0 sm:py-5 bg-[var(--light-color)] rounded-2xl">
          <ProductBenefits />
        </div>

        <div className=" max-w-7xl mx-auto px-0 sm:px-8 py-0 sm:py-5 bg-[var(--light-color)] rounded-2xl">
          <BenefitsSlider />
        </div>

        <div className=" max-w-7xl mx-auto px-0 sm:px-8 py-0 sm:py-5 bg-[var(--light-color)] rounded-2xl">
          <StepbyStep />
        </div>


      </div>
      <div className=" max-w-7xl mx-auto px-0 sm:px-8 py-0 sm:py-5 rounded-2xl">
        <ReviewList />
      </div>
    </>
  );
}
