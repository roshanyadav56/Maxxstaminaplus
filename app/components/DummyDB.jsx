// DUMMY DATABASE (in-memory)
export let users = [
  { id: 1, name: "Kanha Yadav", email: "test@example.com", password: "123456" }
];

export let profile = {
  firstName: "Kanha",
  lastName: "Yadav",
  email: "test@example.com",
  address: "Some Street, India",
};

// SIMPLE ORDERS LIST (for Account Page)
export const orders = [
  {
    id: 1,
    title: "SHILAJIT GOLD (15ml Pack)",
    orderId: "33546546546526",
    price: 459,
    date: "Sep 26",
    status: "delivered",
    img: "/assets/Images/ShilajitGold.png"
  },
  {
    id: 2,
    title: "SHILAJIT GOLD (15ml Pack)",
    orderId: "33546546546526",
    price: 459,
    date: "Sep 26",
    status: "pending",
    img: "/assets/Images/ShilajitGold.png"
  },
  {
    id: 3,
    title: "SHILAJIT GOLD (15ml Pack)",
    orderId: "33546546546526",
    price: 459,
    date: "Sep 26",
    status: "cancelled",
    img: "/assets/Images/ShilajitGold.png"
  }
];

export let wishlist = [
  { id: 1, title: "MaxxStaminaPlus Oil" },
  { id: 2, title: "Premium Rose Oil" },
];

// FULL ORDER DETAILS FOR TRACKING PAGE
export const orderDetails = {
  orderId: "33546546546526",
  orderDate: "Nov 07, 2025",
  estimatedDelivery: "Nov 17, 2025",
  status: "delivered",

  timeline: {
    confirmed: "Fri, 7th Nov",
    shipped: "Mon, 10th Nov",
    outForDelivery: "Sun, 16th Nov",
    delivered: "Mon, 17th Nov",
  },

  items: [
    {
      id: 1,
      title: "SHILAJIT GOLD (15ml Pack)",
      price: 2599,
      qty: 1,
      img: "/assets/Images/ShilajitGold.png"
    },
    {
      id: 2,
      title: "SHILAJIT GOLD (15ml Pack)",
      price: 2599,
      qty: 2,
      img: "/assets/Images/ShilajitGold.png"
    }
  ],

  summary: {
    price: 918,
    discountPercent: 20,
    discount: 918,
    delivery: 0,
    tax: 78,
    total: 812
  },

  payment: {
    method: "Visa **56"
  },

  delivery: {
    address: "S-96, Barkat Nagar Rd, Tonk Phatak, Jaipur, Rajasthan 302015"
  }
};
