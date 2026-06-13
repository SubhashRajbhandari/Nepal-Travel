import bcrypt from "bcryptjs";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../lib/generated/prisma/client";
import { createSlug } from "../lib/slug";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

const categories = [
  {
    name: "Trekking Trails",
    description: "Popular Himalayan trekking routes and mountain journeys.",
  },
  {
    name: "Religious Places",
    description: "Sacred temples, monasteries, and pilgrimage destinations.",
  },
  {
    name: "Exotic/Natural Environments",
    description: "Lakes, forests, viewpoints, wildlife areas, and scenic places.",
  },
  {
    name: "Motorbike Routes",
    description: "Road trips and riding routes through hills, valleys, and mountains.",
  },
  {
    name: "Adventure Points",
    description: "Destinations for outdoor activities, wildlife, and adventure travel.",
  },
  {
    name: "Cultural Centers",
    description: "Historic towns and places known for local lifestyle and heritage.",
  },
];

const destinations = [
  {
    name: "Everest Base Camp",
    category: "Trekking Trails",
    location: "Solukhumbu, Koshi Province",
    difficulty: "EXTREME",
    estimatedBudget: 160000,
    bestTimeToVisit: "March to May and September to November",
    duration: "12-14 days",
    localFood: ["Dal bhat", "Sherpa stew", "Thukpa", "Tibetan bread"],
    nearbyAttractions: ["Namche Bazaar", "Tengboche Monastery", "Kala Patthar"],
    transportation: "Fly to Lukla from Kathmandu, then trek through Phakding and Namche.",
    safetyTips: ["Acclimatize properly", "Carry warm layers", "Use a licensed guide"],
    description:
      "A world-famous Himalayan trek that takes travelers close to Mount Everest through Sherpa villages, monasteries, and dramatic mountain views.",
    imageUrls: ["/images/destinations/everest-base-camp.jpg"],
    isFeatured: true,
  },
  {
    name: "Annapurna Base Camp",
    category: "Trekking Trails",
    location: "Kaski, Gandaki Province",
    difficulty: "HARD",
    estimatedBudget: 90000,
    bestTimeToVisit: "March to May and October to November",
    duration: "7-10 days",
    localFood: ["Dal bhat", "Gurung bread", "Noodle soup", "Apple pie"],
    nearbyAttractions: ["Ghandruk", "Machhapuchhre Base Camp", "Jhinu Hot Spring"],
    transportation: "Drive from Pokhara to Nayapul or Jhinu, then trek toward base camp.",
    safetyTips: ["Check weather updates", "Carry rain protection", "Walk at a steady pace"],
    description:
      "A beautiful trek into the Annapurna Sanctuary with close views of Annapurna, Machhapuchhre, and traditional Gurung villages.",
    imageUrls: ["/images/destinations/annapurna-base-camp.jpg"],
    isFeatured: true,
  },
  {
    name: "Pashupatinath Temple",
    category: "Religious Places",
    location: "Kathmandu, Bagmati Province",
    difficulty: "EASY",
    estimatedBudget: 3000,
    bestTimeToVisit: "September to April",
    duration: "Half day",
    localFood: ["Newari khaja set", "Sel roti", "Tea", "Momo"],
    nearbyAttractions: ["Boudhanath Stupa", "Guhyeshwari Temple", "Bagmati River"],
    transportation: "Taxi, bus, or ride sharing from central Kathmandu.",
    safetyTips: ["Respect temple rules", "Keep valuables safe", "Ask before taking photos"],
    description:
      "One of Nepal's most important Hindu temples, located beside the Bagmati River and known for its spiritual and cultural significance.",
    imageUrls: ["/images/destinations/pashupatinath-temple.jpg"],
  },
  {
    name: "Lumbini",
    category: "Religious Places",
    location: "Rupandehi, Lumbini Province",
    difficulty: "EASY",
    estimatedBudget: 18000,
    bestTimeToVisit: "October to March",
    duration: "1-2 days",
    localFood: ["Tharu food", "Dal bhat", "Lassi", "Local sweets"],
    nearbyAttractions: ["Maya Devi Temple", "Ashoka Pillar", "World Peace Pagoda"],
    transportation: "Fly or drive to Bhairahawa, then take local transport to Lumbini.",
    safetyTips: ["Carry water in hot months", "Dress respectfully", "Use sun protection"],
    description:
      "The birthplace of Lord Buddha, Lumbini is a peaceful pilgrimage site with monasteries, gardens, and important Buddhist landmarks.",
    imageUrls: ["/images/destinations/lumbini.jpg"],
  },
  {
    name: "Pokhara",
    category: "Exotic/Natural Environments",
    location: "Kaski, Gandaki Province",
    difficulty: "EASY",
    estimatedBudget: 25000,
    bestTimeToVisit: "September to May",
    duration: "2-4 days",
    localFood: ["Trout fish", "Thakali khana", "Momo", "Laphing"],
    nearbyAttractions: ["Phewa Lake", "Sarangkot", "Davis Falls", "World Peace Pagoda"],
    transportation: "Tourist bus or flight from Kathmandu.",
    safetyTips: ["Use life jackets near lakes", "Book adventure activities with licensed operators"],
    description:
      "A relaxing lake city famous for mountain views, boating, caves, sunrise points, and adventure activities.",
    imageUrls: ["/images/destinations/pokhara.jpg"],
    isFeatured: true,
  },
  {
    name: "Rara Lake",
    category: "Exotic/Natural Environments",
    location: "Mugu, Karnali Province",
    difficulty: "HARD",
    estimatedBudget: 70000,
    bestTimeToVisit: "April to June and September to October",
    duration: "5-7 days",
    localFood: ["Dal bhat", "Local potatoes", "Noodle soup", "Yak cheese"],
    nearbyAttractions: ["Rara National Park", "Murma Top", "Mugu villages"],
    transportation: "Fly to Talcha via Nepalgunj or combine road travel and trekking.",
    safetyTips: ["Prepare for remote travel", "Carry cash", "Pack warm clothes"],
    description:
      "Nepal's largest lake, known for deep blue water, quiet forests, remote landscapes, and peaceful natural beauty.",
    imageUrls: ["/images/destinations/rara-lake.jpg"],
  },
  {
    name: "Upper Mustang",
    category: "Motorbike Routes",
    location: "Mustang, Gandaki Province",
    difficulty: "HARD",
    estimatedBudget: 120000,
    bestTimeToVisit: "March to November",
    duration: "7-10 days",
    localFood: ["Thakali khana", "Buckwheat bread", "Apple products", "Tibetan tea"],
    nearbyAttractions: ["Lo Manthang", "Muktinath", "Kagbeni", "Chhoser caves"],
    transportation: "Jeep or motorbike from Pokhara through Beni, Jomsom, and Kagbeni.",
    safetyTips: ["Check road condition", "Carry permits", "Ride slowly on gravel roads"],
    description:
      "A dramatic trans-Himalayan route with desert-like landscapes, ancient settlements, caves, monasteries, and Tibetan-influenced culture.",
    imageUrls: ["/images/destinations/upper-mustang.jpg"],
    isFeatured: true,
  },
  {
    name: "Chitwan National Park",
    category: "Adventure Points",
    location: "Chitwan, Bagmati Province",
    difficulty: "EASY",
    estimatedBudget: 28000,
    bestTimeToVisit: "October to March",
    duration: "2-3 days",
    localFood: ["Tharu khana", "Fish curry", "Dal bhat", "Local pickles"],
    nearbyAttractions: ["Sauraha", "Rapti River", "Elephant Breeding Center"],
    transportation: "Tourist bus, private vehicle, or flight to Bharatpur.",
    safetyTips: ["Follow jungle guide instructions", "Avoid feeding wildlife", "Use insect repellent"],
    description:
      "A popular wildlife destination where travelers can experience jungle safari, bird watching, Tharu culture, and river activities.",
    imageUrls: ["/images/destinations/chitwan-national-park.jpg"],
  },
  {
    name: "Bandipur",
    category: "Cultural Centers",
    location: "Tanahun, Gandaki Province",
    difficulty: "EASY",
    estimatedBudget: 12000,
    bestTimeToVisit: "September to April",
    duration: "1-2 days",
    localFood: ["Newari khaja", "Sel roti", "Local curry", "Tea"],
    nearbyAttractions: ["Tundikhel viewpoint", "Siddha Cave", "Old Bazaar"],
    transportation: "Drive from Kathmandu or Pokhara to Dumre, then take local transport uphill.",
    safetyTips: ["Wear comfortable shoes", "Carry light jacket", "Respect heritage areas"],
    description:
      "A preserved hilltop town known for Newari architecture, mountain views, traditional streets, and peaceful village charm.",
    imageUrls: ["/images/destinations/bandipur.jpg"],
  },
  {
    name: "Manang",
    category: "Trekking Trails",
    location: "Manang, Gandaki Province",
    difficulty: "HARD",
    estimatedBudget: 85000,
    bestTimeToVisit: "March to May and September to November",
    duration: "6-9 days",
    localFood: ["Yak cheese", "Thukpa", "Dal bhat", "Tibetan bread"],
    nearbyAttractions: ["Gangapurna Lake", "Ice Lake", "Braga Monastery"],
    transportation: "Drive from Besisahar toward Chame or Manang, depending on road condition.",
    safetyTips: ["Acclimatize before higher passes", "Carry altitude medicine", "Check landslide updates"],
    description:
      "A mountain valley on the Annapurna Circuit with dry landscapes, lakes, monasteries, and excellent acclimatization stops.",
    imageUrls: ["/images/destinations/manang.jpg"],
  },
  {
    name: "Muktinath",
    category: "Religious Places",
    location: "Mustang, Gandaki Province",
    difficulty: "MODERATE",
    estimatedBudget: 50000,
    bestTimeToVisit: "March to June and September to November",
    duration: "3-5 days",
    localFood: ["Thakali khana", "Apple pie", "Buckwheat dishes", "Tibetan tea"],
    nearbyAttractions: ["Kagbeni", "Jomsom", "Dhumba Lake"],
    transportation: "Fly, jeep, or bike route through Pokhara, Jomsom, and Ranipauwa.",
    safetyTips: ["Prepare for altitude", "Carry warm clothing", "Check road and flight delays"],
    description:
      "A sacred pilgrimage site for Hindus and Buddhists, located below Thorong La and surrounded by Mustang's unique landscape.",
    imageUrls: ["/images/destinations/muktinath.jpg"],
  },
  {
    name: "Nagarkot",
    category: "Exotic/Natural Environments",
    location: "Bhaktapur, Bagmati Province",
    difficulty: "EASY",
    estimatedBudget: 8000,
    bestTimeToVisit: "October to April",
    duration: "1 day",
    localFood: ["Newari khaja", "Dal bhat", "Tea", "Momo"],
    nearbyAttractions: ["Nagarkot View Tower", "Changunarayan Temple", "Bhaktapur Durbar Square"],
    transportation: "Drive from Kathmandu or Bhaktapur by bus, taxi, or private vehicle.",
    safetyTips: ["Start early for sunrise", "Carry a jacket", "Check visibility before going"],
    description:
      "A nearby hill station from Kathmandu famous for sunrise, Himalayan views, short hikes, and peaceful stays.",
    imageUrls: ["/images/destinations/nagarkot.jpg"],
  },
];

async function main() {
  const passwordHash = await bcrypt.hash("admin12345", 12);

  await prisma.user.upsert({
    where: { email: "admin@nepaltravel.test" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@nepaltravel.test",
      passwordHash,
      role: "ADMIN",
    },
  });

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: createSlug(category.name) },
      update: category,
      create: {
        ...category,
        slug: createSlug(category.name),
      },
    });
  }

  const categoryRows = await prisma.category.findMany();
  const categoryByName = new Map(categoryRows.map((category) => [category.name, category]));

  for (const destination of destinations) {
    const { category: categoryName, localFood, nearbyAttractions, safetyTips, imageUrls, ...destinationData } = destination;
    const category = categoryByName.get(categoryName);

    if (!category) {
      throw new Error(`Missing category: ${categoryName}`);
    }

    const stringifiedData = {
      localFood: JSON.stringify(localFood || []),
      nearbyAttractions: JSON.stringify(nearbyAttractions || []),
      safetyTips: JSON.stringify(safetyTips || []),
      imageUrls: JSON.stringify(imageUrls || []),
    };

    await prisma.destination.upsert({
      where: { slug: createSlug(destination.name) },
      update: {
        ...destinationData,
        ...stringifiedData,
        categoryId: category.id,
      },
      create: {
        ...destinationData,
        ...stringifiedData,
        slug: createSlug(destination.name),
        categoryId: category.id,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
