export default function ProductBenefits() {
  const benefits = [
    {
      icon: "/assets/images/ayurveda.png",   // 🔹 Put your icon
      title: "Formulated by",
      sub: "Ayurvedic Experts",
    },
    {
      icon: "/assets/images/discount.png",   // 🔹 Put your icon
      title: "5% off on",
      sub: "online payment",
    },
  ];

  return (
    <div className="flex items-center  justify-center gap-20">

      {benefits.map((item, i) => (
        <div key={i} className="flex flex-col items-center text-center">

          {/* ICON WRAPPER */}
          <div className="w-20 h-20 rounded-full bg-[var(--bg-muted)] flex items-center justify-center shadow-sm">
            <img src={item.icon} className="object-contain opacity-90" />
          </div>

          {/* TITLE */}
          <p className="mt-2 text-sm font-semibold text-[var(--dark-color)] leading-tight">
            {item.title} <br />
            {item.sub}
          </p>
        </div>
      ))}

    </div>
  );
}
