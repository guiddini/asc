export const tickets = [
  {
    category: "FREE",
    title: "0 DA",
    duration: "Trois Jours",
    features: [
      { text: "Access to the exhibition" },
      { text: "Access to the opening ceremony" },
      { text: "Free networking" },
    ],
    price: 0,
    slug: "free", // Added slug
  },
  {
    category: "BASIC",
    title: "2000 DA",
    duration: "Trois Jours",
    features: [
      { text: "Accès à la Cérémonie d'ouverture" },
      { text: "Accès à l'exposition" },
      { text: "Accès aux conférences" },
      { text: "Accès aux Ateliers" },
      { text: "Accès au SANDBOX UX" },
      { text: "Accès au Village Kids & Money" },
      { text: "Accès au Startup Battle" },
      { text: "Accès au pause café" },
    ],
    price: 2000,
    pricePerPerson: false,
    slug: "basic", // Added slug
  },
  {
    category: "VIP STARTER",
    title: "30 000 DA",
    duration: "Trois Jours",
    features: [
      { text: "Accès à la Cérémonie d'ouverture" },
      { text: "Accès à l'exposition" },
      { text: "Accès VIP aux conférences" },
      { text: "Accès VIP aux Ateliers" },
      { text: "Déjeuné trois jours" },
      { text: "Accès aux nouveautés" },
      { text: "VIP Lounge & pause café" },
      { text: "Assistance assurée" },
    ],
    price: 30000,
    pricePerPerson: true,
    slug: "entreprise-starter", // Added slug
  },
  {
    category: "VIP ESSENCIEL",
    title: "60 000 DA",
    duration: "Trois Jours",
    features: [
      { text: "Accès à la Cérémonie d'ouverture" },
      { text: "Accès à l'exposition" },
      { text: "Accès VIP aux conférences" },
      { text: "Accès VIP aux Ateliers" },
      { text: "Déjeuné trois jours" },
      { text: "Accès aux nouveautés" },
      { text: "VIP Lounge & pause café" },
      { text: "Assistance assurée" },
      { text: "Cérémonie de clôture" },
    ],
    price: 60000,
    pricePerPerson: true,
    slug: "entreprise-essenciel", // Added slug
  },
  {
    category: "VIP ALL-INCLUSIVE",
    title: "120 000 DA",
    duration: "Trois Jours",
    features: [
      { text: "Accès à la Cérémonie d'ouverture" },
      { text: "Accès à l'exposition" },
      { text: "Accès VIP aux conférences" },
      { text: "Accès VIP aux Ateliers" },
      { text: "Accès aux nouveautés" },
      { text: "VIP Lounge & pause café" },
      { text: "Assistance assurée" },
      { text: "Déjeuné trois jours" },
      { text: "Cérémonie de clôture" },
      { text: "Hébergement avec dîner inclus" },
    ],
    price: 120000,
    pricePerPerson: true,
    slug: "entreprise-all-inclusive", // Added slug
  },
];
