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

  // ⭐ MULTIPLE MESSAGE DETAILED TIMELINE (for “See All Updates”)
  timelineDetails: {
    confirmed: [
      { msg: "Your Order has been placed.", time: "Fri, 7 Nov • 8:42am" },
      { msg: "Seller has processed your order.", time: "Fri, 7 Nov • 12:15pm" },
      { msg: "Your item has been picked up by delivery partner.", time: "Sat, 8 Nov • 6:18am" }
    ],

    shipped: [
      { msg: "Ekart Logistics - FMPC4937998456" },
      { msg: "Your item has been shipped.", time: "Mon, 10 Nov • 9:31am" },
      { msg: "Your item has been received in the nearest hub.", time: "Tue, 11 Nov • 7:12pm" }
    ],

    outForDelivery: [
      { msg: "Your item is out for delivery.", time: "Sun, 16 Nov • 8:05am" }
    ],

    delivered: [
      { msg: "Your item has been delivered.", time: "Mon, 17 Nov • 3:26pm" }
    ]
  },

  items: [
    {
      id: 1,
      title: "SHILAJIT GOLD (15ml Pack)",
      price: 459,
      qty: 1,
      img: "/assets/Images/ShilajitGold.png"
    },
    {
      id: 2,
      title: "SHILAJIT GOLD Resin",
      price: 459,
      qty: 1,
      img: "/assets/Images/ShilajitGold.png"
    }
  ],

summary: {
  listingPrice: 1010,     // MUST BE ADDED
  price: 918,
  discountPercent: 10,
  discount: 91.08,
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
