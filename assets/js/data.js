/* =========================================================
   Al Burouj — page data (edit prices / units here only)
   ========================================================= */
const SITE_CONFIG = {
  whatsappNumber: "", // international format without + e.g. 2010xxxxxxxx  (TBD)
  projectName: "البروج",
  defaultWaMessage: "مرحبًا، أرغب في معرفة تفاصيل الوحدات المتاحة في كمبوند البروج",
};

const DELIVERY = {
  ready: "استلام فوري",
  y2: "استلام خلال سنتين",
  y4: "استلام خلال 4 سنين",
};

/* One card per unit type.
   from      = lowest available price (EGP)
   area      = [min, max] m²
   years     = longest installment plan for this type
   zeroDown  = true if a 0% down-payment option exists
   delivery  = delivery options shown as clickable labels
   options   = full detail (not shown on card — reference for sales / WhatsApp) */
const UNIT_TYPES = [
  {
    id: "apartments",
    title: "شقق",
    img: "assets/img/gallery/alburouj-14.jpg",
    area: [70, 182],
    from: 5940000,
    years: 10,
    zeroDown: true,
    delivery: ["y2", "y4"],
    rooms: ["غرفة نوم", "غرفتين نوم", "3 غرف نوم"],
    options: [
      { d: "y2", name: "1 غرفة نوم – تشطيب كامل", area: "70", price: 5940000 },
      { d: "y4", name: "غرفتين – U-by Clubside – تشطيب كامل", area: "112–152", price: 9336000 },
      { d: "y4", name: "غرفتين أرضي + جاردن 47م²", area: "112", price: 9471000 },
      { d: "y4", name: "3 غرف – U-by Clubside – تشطيب كامل", area: "162–182", price: 12417000 },
    ],
  },
  {
    id: "duplexes",
    title: "دوبلكس",
    img: "assets/img/gallery/alburouj-15.jpg",
    area: [197, 276],
    from: 15270000,
    years: 6,
    zeroDown: true,
    delivery: ["ready", "y2"],
    options: [
      { d: "ready", name: "دوبلكس علوي – تشطيب كامل", area: "276", price: 17720000 },
      { d: "y2", name: "دوبلكس بجاردن – Core & Shell", area: "197", price: 15270000 },
      { d: "y2", name: "دوبلكس علوي – Core & Shell", area: "274", price: 18820000 },
    ],
  },
  {
    id: "townhouses",
    title: "تاون هاوس",
    img: "assets/img/gallery/alburouj-05.jpg",
    area: [156, 245],
    from: 15948000,
    years: 10,
    zeroDown: false,
    delivery: ["y4"],
    options: [
      { d: "y4", name: "تاون هاوس – Orchid Villas", area: "156", price: 15948000 },
      { d: "y4", name: "تاون هاوس ميدل", area: "236", price: 19153000 },
      { d: "y4", name: "تاون هاوس كورنر", area: "245", price: 21164000 },
    ],
  },
  {
    id: "twinhouses",
    title: "توين هاوس",
    img: "assets/img/gallery/alburouj-12.jpg",
    area: [215, 373],
    from: 24970000,
    years: 6,
    zeroDown: true,
    delivery: ["ready", "y2"],
    options: [
      { d: "ready", name: "توين هاوس – تشطيب كامل", area: "373", price: 42250000 },
      { d: "y2", name: "توين هاوس – Core & Shell", area: "215", price: 24970000 },
      { d: "y2", name: "توين هاوس – Core & Shell", area: "315", price: 28180000 },
    ],
  },
  {
    id: "villas",
    title: "فيلات مستقلة",
    img: "assets/img/gallery/alburouj-16.jpg",
    area: [264, 762],
    from: 25899000,
    years: 10,
    zeroDown: false,
    delivery: ["y4"],
    options: [
      { d: "y4", name: "فيلا مستقلة – Orchid Villas", area: "264", price: 25899000 },
      { d: "y4", name: "مانشن", area: "762", price: 94980000 },
    ],
  },
];


/* Payment plans section.
   discount: % off vs the longest plan — set a number when confirmed (null = shown as "بخصم" + opens form) */
const PAYMENT_PLANS = [
  {
    key: "ready",
    title: "استلام فوري",
    down: "20%",
    years: 6,
    units: "دوبلكس • توين هاوس — تشطيب كامل",
  },
  {
    key: "y2",
    title: "استلام خلال سنتين",
    down: "0%",
    years: 6,
    units: "شقق • دوبلكس • توين هاوس",
  },
  {
    key: "y4",
    title: "استلام خلال 4 سنين",
    down: null,
    years: 10,
    units: "شقق U-by Clubside • تاون هاوس • فيلات",
    options: [
      { years: 8, discount: null },
      { years: 6, discount: null },
      { years: 4, discount: null },
    ],
  },
];

/* Gallery (order = display order) */
const GALLERY = [5, 3, 14, 17, 15, 4, 12, 16, 13, 2, 8, 10, 6, 7, 11, 18, 9, 1].map(
  (n) => `assets/img/gallery/alburouj-${String(n).padStart(2, "0")}.jpg`
);
