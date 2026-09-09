export const LEADERBOARD = [
  { id: "u1", name: "Aanya Rao", handle: "aanya", country: "India", city: "Bengaluru", points: 12450, co2: 341, streak: 48, circle: "friends" },
  { id: "u2", name: "Rahul Menon", handle: "rahulm", country: "India", city: "Kochi", points: 11820, co2: 312, streak: 41, circle: "friends" },
  { id: "u3", name: "Priya Nair", handle: "priya.n", country: "India", city: "Pune", points: 10950, co2: 298, streak: 36, circle: "friends" },
  { id: "u4", name: "Marta Oliveira", handle: "marta", country: "Brazil", city: "São Paulo", points: 10420, co2: 284, streak: 29, circle: "global" },
  { id: "u5", name: "Jonas Weber", handle: "jonasw", country: "Germany", city: "Freiburg", points: 9880, co2: 271, streak: 33, circle: "global" },
  { id: "u6", name: "Amara Okafor", handle: "amara", country: "Nigeria", city: "Lagos", points: 9210, co2: 246, streak: 21, circle: "friends" },
  { id: "u7", name: "Sofia Rossi", handle: "sofi", country: "Italy", city: "Bologna", points: 8740, co2: 233, streak: 25, circle: "global" },
  { id: "u8", name: "Kenji Watanabe", handle: "kenji", country: "Japan", city: "Kyoto", points: 8320, co2: 228, streak: 30, circle: "global" },
  { id: "u9", name: "Lena Novak", handle: "lena", country: "Slovenia", city: "Ljubljana", points: 7910, co2: 205, streak: 18, circle: "global" },
  { id: "u10", name: "Diego Muñoz", handle: "diego", country: "Chile", city: "Valparaíso", points: 7480, co2: 197, streak: 22, circle: "friends" },
  { id: "u11", name: "Hana Yusuf", handle: "hana", country: "Malaysia", city: "Penang", points: 7020, co2: 188, streak: 16, circle: "global" },
  { id: "u12", name: "Oliver Brooks", handle: "oliverb", country: "United Kingdom", city: "Bristol", points: 6640, co2: 176, streak: 19, circle: "friends" },
  { id: "u13", name: "Nia Williams", handle: "nia", country: "Canada", city: "Vancouver", points: 6210, co2: 164, streak: 14, circle: "global" },
  { id: "u14", name: "Tomas Eriksen", handle: "tomas", country: "Denmark", city: "Aarhus", points: 5870, co2: 151, streak: 27, circle: "global" },
  { id: "u15", name: "Zara Ahmed", handle: "zara", country: "Bangladesh", city: "Dhaka", points: 5420, co2: 143, streak: 12, circle: "global" },
];

export const COMMUNITY_STATS = {
  co2Saved: 850000,
  actions: 2400000,
  champions: 75000,
  wasteAvoided: 420000,
  cities: 1240,
  countries: 96,
};

/** Pin coordinates are percentage positions on the globe face. */
export const HOTSPOTS = [
  { id: "bengaluru", city: "Bengaluru", country: "India", x: 71, y: 46, actions: 214_800, co2: 61_400, champions: 9_120 },
  { id: "nairobi", city: "Nairobi", country: "Kenya", x: 57, y: 57, actions: 88_400, co2: 21_900, champions: 4_310 },
  { id: "freiburg", city: "Freiburg", country: "Germany", x: 48, y: 31, actions: 143_600, co2: 47_200, champions: 6_880 },
  { id: "vancouver", city: "Vancouver", country: "Canada", x: 15, y: 33, actions: 97_500, co2: 33_600, champions: 5_140 },
  { id: "kyoto", city: "Kyoto", country: "Japan", x: 85, y: 38, actions: 121_300, co2: 38_900, champions: 6_020 },
  { id: "saopaulo", city: "São Paulo", country: "Brazil", x: 32, y: 64, actions: 156_900, co2: 42_700, champions: 7_460 },
  { id: "lagos", city: "Lagos", country: "Nigeria", x: 47, y: 52, actions: 79_800, co2: 18_300, champions: 3_980 },
  { id: "melbourne", city: "Melbourne", country: "Australia", x: 88, y: 74, actions: 66_200, co2: 24_500, champions: 3_210 },
  { id: "london", city: "London", country: "United Kingdom", x: 44, y: 27, actions: 132_700, co2: 36_100, champions: 6_540 },
];

export const COUNTRY_ROWS = [
  { country: "India", flag: "🇮🇳", co2: 186_400, champions: 18_900, growth: 12.4 },
  { country: "Germany", flag: "🇩🇪", co2: 121_800, champions: 11_400, growth: 6.1 },
  { country: "Brazil", flag: "🇧🇷", co2: 98_600, champions: 9_200, growth: 14.8 },
  { country: "United Kingdom", flag: "🇬🇧", co2: 87_300, champions: 8_600, growth: 4.9 },
  { country: "Japan", flag: "🇯🇵", co2: 79_400, champions: 7_800, growth: 5.6 },
  { country: "Kenya", flag: "🇰🇪", co2: 41_900, champions: 4_300, growth: 19.2 },
  { country: "Canada", flag: "🇨🇦", co2: 38_600, champions: 5_100, growth: 3.4 },
  { country: "Nigeria", flag: "🇳🇬", co2: 33_200, champions: 4_000, growth: 22.7 },
];

export const NEWS = [
  { id: "n1", icon: "🌱", title: "You completed today's climate action", body: "Cold-wash laundry logged. +30 Eco Points banked.", time: "12m ago", kind: "action" },
  { id: "n2", icon: "🔥", title: "You're on a 12-day streak", body: "Log one action today to keep the flame alive.", time: "2h ago", kind: "streak" },
  { id: "n3", icon: "🏆", title: "You moved up 5 places", body: "You're now #212 globally — 41 places from the top 150.", time: "Yesterday", kind: "rank" },
  { id: "n4", icon: "🌍", title: "Community crossed 850K kg", body: "EcoSphere members passed 850,000 kg of CO₂ saved together.", time: "2 days ago", kind: "community" },
  { id: "n5", icon: "♻️", title: "Badge progress: Waste Warrior", body: "You're 3 actions away from unlocking Waste Warrior.", time: "3 days ago", kind: "badge" },
];
