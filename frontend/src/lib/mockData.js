// Mock data mimicking the Backend Product Schema:
// {
//   name: String,
//   description: String,
//   images: [String],
//   starting_price: Number,
//   currentBid: Number,
//   highestBidder: ObjectId,
//   duration: Number,
//   endTime: Date,
//   status: ["pending", "live", "ended"],
//   AuctionWinner: ObjectId,
//   owner: ObjectId,
//   category: ObjectId,
//   timestamps: true
// }

const CATEGORIES = {
  SNEAKERS: "60d5ecb8b392d700153f3a11",
  WATCHES: "60d5ecb8b392d700153f3a12",
  CARS: "60d5ecb8b392d700153f3a13",
  ART: "60d5ecb8b392d700153f3a14"
};

const USERS = {
  SYSTEM: "60d5ecb8b392d700153f3b00",
  ALEX99: "60d5ecb8b392d700153f3b01",
  JANE: "60d5ecb8b392d700153f3b02",
  GUEST: "60d5ecb8b392d700153f3b03"
};

// Use a fixed base date so end times are exactly the same across all page reloads for all users
// This ensures the countdown timers are consistent.
const BASE_DATE = new Date("2026-05-20T12:00:00Z").getTime();

export const MOCK_AUCTIONS = [
  {
    _id: "60d5ecb8b392d700153f3c01",
    name: "Air Jordan 1 Retro High Dior",
    description: "A pristine pair of the highly coveted Air Jordan 1 Retro High Dior. Limited to 8,500 pairs worldwide, featuring the iconic Dior Oblique jacquard swoosh and premium Italian leather construction. Complete with original box and accessories.",
    images: [
      "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=800&q=80",
      "https://images.unsplash.com/photo-1552346154-21d32810baa3?w=800&q=80"
    ],
    starting_price: 5000,
    currentBid: 8500,
    highestBidder: USERS.ALEX99,
    duration: 86400, // 24 hours in seconds
    endTime: new Date(BASE_DATE + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from base
    status: "live",
    AuctionWinner: null,
    owner: USERS.SYSTEM,
    category: CATEGORIES.SNEAKERS,
    createdAt: new Date(BASE_DATE - 22 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(BASE_DATE - 5 * 60 * 1000).toISOString(),
  },
  {
    _id: "60d5ecb8b392d700153f3c02",
    name: "Rolex Daytona Platinum Ice Blue",
    description: "The Rolex Cosmograph Daytona in 950 platinum with an ice blue dial and chestnut brown Cerachrom bezel. A masterpiece of horology and one of the most sought-after watches globally.",
    images: [
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80"
    ],
    starting_price: 80000,
    currentBid: 125000,
    highestBidder: USERS.JANE,
    duration: 172800,
    endTime: new Date(BASE_DATE + 14 * 60 * 60 * 1000).toISOString(),
    status: "live",
    AuctionWinner: null,
    owner: USERS.ALEX99,
    category: CATEGORIES.WATCHES,
    createdAt: new Date(BASE_DATE - 48 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(BASE_DATE).toISOString(),
  },
  {
    _id: "60d5ecb8b392d700153f3c03",
    name: "Vintage Porsche 911 Carrera RS 2.7",
    description: "Immaculate 1973 Porsche 911 Carrera RS 2.7 in Grand Prix White with Red Carrera script. Matching numbers, fully restored by Porsche Classic. A true collector's dream.",
    images: [
      "https://images.unsplash.com/photo-1503376760367-5332205562d5?w=800&q=80"
    ],
    starting_price: 500000,
    currentBid: 500000,
    highestBidder: null,
    duration: 604800,
    endTime: new Date(BASE_DATE + 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: "pending",
    AuctionWinner: null,
    owner: USERS.SYSTEM,
    category: CATEGORIES.CARS,
    createdAt: new Date(BASE_DATE).toISOString(),
    updatedAt: new Date(BASE_DATE).toISOString(),
  },
  {
    _id: "60d5ecb8b392d700153f3c04",
    name: "Original Banksy - Girl with Balloon",
    description: "Authentication included. Original 2004 screenprint of the iconic Girl with Balloon. Numbered out of 600.",
    images: [
      "https://images.unsplash.com/photo-1577720580479-7d839d829c73?w=800&q=80"
    ],
    starting_price: 100000,
    currentBid: 340000,
    highestBidder: USERS.ALEX99,
    duration: 259200,
    endTime: new Date(BASE_DATE - 10000).toISOString(), // Ended
    status: "ended",
    AuctionWinner: USERS.ALEX99,
    owner: USERS.SYSTEM,
    category: CATEGORIES.ART,
    createdAt: new Date(BASE_DATE - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(BASE_DATE).toISOString(),
  },
  {
    _id: "60d5ecb8b392d700153f3c05",
    name: "McLaren P1 Chrome Edition",
    description: "One of one chrome edition McLaren P1. Minimal mileage, perfect condition.",
    images: [
      "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&q=80"
    ],
    starting_price: 1200000,
    currentBid: 1450000,
    highestBidder: USERS.GUEST,
    duration: 432000,
    endTime: new Date(BASE_DATE + 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: "live",
    AuctionWinner: null,
    owner: USERS.SYSTEM,
    category: CATEGORIES.CARS,
    createdAt: new Date(BASE_DATE).toISOString(),
    updatedAt: new Date(BASE_DATE).toISOString(),
  },
  {
    _id: "60d5ecb8b392d700153f3c06",
    name: "Patek Philippe Nautilus 5711",
    description: "Stainless steel Nautilus with blue dial. The holy grail of steel sports watches.",
    images: [
      "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800&q=80"
    ],
    starting_price: 100000,
    currentBid: 145000,
    highestBidder: USERS.JANE,
    duration: 172800,
    endTime: new Date(BASE_DATE + 3 * 60 * 60 * 1000).toISOString(),
    status: "live",
    AuctionWinner: null,
    owner: USERS.SYSTEM,
    category: CATEGORIES.WATCHES,
    createdAt: new Date(BASE_DATE).toISOString(),
    updatedAt: new Date(BASE_DATE).toISOString(),
  }
];

// Generate more mock data for infinite scrolling
// Use a simple seeded pseudo-random function to keep properties identical across reloads
const pseudoRandom = (seed) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

for (let i = 7; i <= 30; i++) {
  const isEnded = pseudoRandom(i) > 0.7;
  const isPending = pseudoRandom(i + 1) > 0.8 && !isEnded;
  const status = isEnded ? "ended" : (isPending ? "pending" : "live");
  
  MOCK_AUCTIONS.push({
    _id: `60d5ecb8b392d700153f3c${i.toString().padStart(2, '0')}`,
    name: `Premium Collectible Item #${i}`,
    description: `A highly sought-after premium collectible, perfect for any serious investor or enthusiast. Limited edition #${i}.`,
    images: [
      `https://images.unsplash.com/photo-${1500000000000 + i * 10000}?w=800&q=80`,
    ],
    starting_price: Math.floor(pseudoRandom(i + 2) * 10000) + 1000,
    currentBid: Math.floor(pseudoRandom(i + 3) * 20000) + 2000,
    highestBidder: pseudoRandom(i + 4) > 0.5 ? USERS.ALEX99 : null,
    duration: 86400 * (Math.floor(pseudoRandom(i + 5) * 7) + 1),
    endTime: new Date(BASE_DATE + (pseudoRandom(i + 6) * 5 * 24 * 60 * 60 * 1000) * (pseudoRandom(i + 7) > 0.2 ? 1 : -1)).toISOString(),
    status: status,
    AuctionWinner: null,
    owner: USERS.SYSTEM,
    category: CATEGORIES.ART,
    createdAt: new Date(BASE_DATE - pseudoRandom(i + 8) * 1000000000).toISOString(),
    updatedAt: new Date(BASE_DATE).toISOString(),
  });
}

// Simulated API Calls
export const fetchAuctions = async (page = 1, limit = 9, filters = {}, sort = 'ending_soon') => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  let results = [...MOCK_AUCTIONS];

  // Apply filters
  if (filters.status && filters.status !== 'all') {
    results = results.filter(a => a.status === filters.status);
  }

  // Apply sort
  if (sort === 'highest_bid') {
    results.sort((a, b) => b.currentBid - a.currentBid);
  } else if (sort === 'ending_soon') {
    results.sort((a, b) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime());
  } else if (sort === 'newly_added') {
    results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const startIndex = (page - 1) * limit;
  const paginatedResults = results.slice(startIndex, startIndex + limit);

  return {
    data: paginatedResults,
    hasMore: startIndex + limit < results.length,
    total: results.length
  };
};

export const fetchAuctionById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const auction = MOCK_AUCTIONS.find(a => a._id === id);
  if (!auction) throw new Error("Auction not found");
  return auction;
};
