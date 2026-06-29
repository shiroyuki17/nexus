import { prisma } from "../lib/prisma.js";

async function main() {
  console.log("Starting database seeding...");

  // 1. Seed Company
  const companyId = process.env.DEFAULT_COMPANY_ID || "demo-company";
  const companyName = process.env.DEFAULT_COMPANY_NAME || "Demo Company";

  const company = await prisma.company.upsert({
    where: { id: companyId },
    update: { name: companyName, slug: companyId },
    create: { id: companyId, name: companyName, slug: companyId },
  });
  console.log(`Company upserted: ${company.name} (${company.id})`);

  // 2. Seed PCs & Notebooks
  const pcsData = [
    {
      pc_number: 1,
      device_type: "pc",
      zone: "standard",
      status: "available",
      specs: "RTX 3060, AMD Ryzen 5 5600, 16GB RAM, 144Hz Monitor",
      hourly_rate: 4.0,
      image_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600",
    },
    {
      pc_number: 2,
      device_type: "pc",
      zone: "standard",
      status: "available",
      specs: "RTX 3060, AMD Ryzen 5 5600, 16GB RAM, 144Hz Monitor",
      hourly_rate: 4.0,
      image_url: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=600",
    },
    {
      pc_number: 3,
      device_type: "pc",
      zone: "standard",
      status: "occupied",
      specs: "RTX 3060, AMD Ryzen 5 5600, 16GB RAM, 144Hz Monitor",
      hourly_rate: 4.0,
      image_url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=600",
    },
    {
      pc_number: 4,
      device_type: "pc",
      zone: "standard",
      status: "available",
      specs: "RTX 3060, AMD Ryzen 5 5600, 16GB RAM, 144Hz Monitor",
      hourly_rate: 4.0,
      image_url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600",
    },
    {
      pc_number: 5,
      device_type: "pc",
      zone: "vip",
      status: "available",
      specs: "RTX 4080, Intel Core i7-13700K, 32GB RAM, 240Hz OLED Monitor",
      hourly_rate: 8.0,
      image_url: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=600",
    },
    {
      pc_number: 6,
      device_type: "pc",
      zone: "vip",
      status: "reserved",
      specs: "RTX 4080, Intel Core i7-13700K, 32GB RAM, 240Hz OLED Monitor",
      hourly_rate: 8.0,
      image_url: "https://images.unsplash.com/photo-1600861195091-690c92f1d2cc?q=80&w=600",
    },
    {
      pc_number: 7,
      device_type: "pc",
      zone: "vip",
      status: "available",
      specs: "RTX 4080, Intel Core i7-13700K, 32GB RAM, 240Hz OLED Monitor",
      hourly_rate: 8.0,
      image_url: "https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?q=80&w=600",
    },
    {
      pc_number: 8,
      device_type: "pc",
      zone: "tournament",
      status: "available",
      specs: "RTX 4090, Intel Core i9-14900K, 64GB RAM, 360Hz ROG Monitor",
      hourly_rate: 12.0,
      image_url: "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?q=80&w=600",
    },
    {
      pc_number: 9,
      device_type: "pc",
      zone: "tournament",
      status: "available",
      specs: "RTX 4090, Intel Core i9-14900K, 64GB RAM, 360Hz ROG Monitor",
      hourly_rate: 12.0,
      image_url: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?q=80&w=600",
    },
    {
      pc_number: 10,
      device_type: "notebook",
      zone: "vip",
      status: "available",
      specs: "Razer Blade 16, RTX 4070 Laptop GPU, Intel Core i9-13950HX, 32GB RAM, 240Hz screen",
      hourly_rate: 8.0,
      image_url: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=600",
    },
    {
      pc_number: 11,
      device_type: "notebook",
      zone: "standard",
      status: "occupied",
      specs: "ASUS TUF Gaming A15, RTX 4050 Laptop GPU, AMD Ryzen 5, 16GB RAM, 144Hz screen",
      hourly_rate: 4.0,
      image_url: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=600",
    },
    {
      pc_number: 12,
      device_type: "notebook",
      zone: "vip",
      status: "available",
      specs: "ROG Zephyrus G14, RTX 4080 Laptop GPU, AMD Ryzen 9, 32GB RAM, 165Hz display",
      hourly_rate: 8.0,
      image_url: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=600",
    },
    {
      pc_number: 13,
      device_type: "notebook",
      zone: "tournament",
      status: "reserved",
      specs: "MSI Raider GE78, RTX 4090 Laptop GPU, Intel Core i9, 64GB RAM, 240Hz display",
      hourly_rate: 12.0,
      image_url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=600",
    }
  ];

  for (const pc of pcsData) {
    await prisma.pc.upsert({
      where: {
        company_id_pc_number: {
          company_id: company.id,
          pc_number: pc.pc_number,
        },
      },
      update: {
        device_type: pc.device_type,
        zone: pc.zone,
        status: pc.status,
        specs: pc.specs,
        hourly_rate: pc.hourly_rate,
        image_url: pc.image_url,
      },
      create: {
        company_id: company.id,
        pc_number: pc.pc_number,
        device_type: pc.device_type,
        zone: pc.zone,
        status: pc.status,
        specs: pc.specs,
        hourly_rate: pc.hourly_rate,
        image_url: pc.image_url,
      },
    });
  }
  console.log(`Seeded/Upserted ${pcsData.length} PCs and Notebooks.`);

  // 3. Seed Games
  const gamesData = [
    {
      title: "Cyberpunk 2077",
      category: "RPG",
      description: "An open-world, action-adventure story set in Night City, a megalopolis obsessed with power, glamour and body modification.",
      image_url: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg",
      is_featured: true,
      popularity: 95,
      min_specs: "Intel Core i7-6700, 12GB RAM, GTX 1060 6GB",
    },
    {
      title: "Grand Theft Auto V",
      category: "RPG",
      description: "When a young street hustler, a retired bank robber and a terrifying psychopath find themselves entangled with some of the most frightening and deranged elements of the underworld.",
      image_url: "https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg",
      is_featured: true,
      popularity: 98,
      min_specs: "Intel Core i5 3470, 8GB RAM, NVIDIA GTX 660 2GB",
    },
    {
      title: "The Witcher 3: Wild Hunt",
      category: "RPG",
      description: "As war rages on throughout the Northern Realms, you take on the greatest contract of your life — tracking down the Child of Prophecy.",
      image_url: "https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg",
      is_featured: false,
      popularity: 94,
      min_specs: "Intel Core i5-2500K, 6GB RAM, Nvidia GPU GeForce GTX 660",
    },
    {
      title: "Portal 2",
      category: "Strategy",
      description: "The single-player portion of Portal 2 introduces a cast of dynamic new characters, a host of fresh puzzle elements, and a much larger set of devious test chambers.",
      image_url: "https://cdn.cloudflare.steamstatic.com/steam/apps/620/header.jpg",
      is_featured: false,
      popularity: 88,
      min_specs: "Intel Pentium 4 3.0 GHz, 2GB RAM, ATI Radeon X800",
    },
    {
      title: "Counter-Strike 2",
      category: "FPS",
      description: "For over two decades, Counter-Strike has offered an elite competitive experience, one shaped by millions of players from across the globe.",
      image_url: "https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg",
      is_featured: true,
      popularity: 99,
      min_specs: "Intel Core i5 7500, 8GB RAM, GTX 1060 3GB",
    },
    {
      title: "Dota 2",
      category: "MOBA",
      description: "Every day, millions of players worldwide enter battle as one of over a hundred Dota heroes. And no matter if it's their 10th hour of play or 1,000th, there's always something new to discover.",
      image_url: "https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg",
      is_featured: true,
      popularity: 96,
      min_specs: "Intel Dual Core, 4GB RAM, NVIDIA GeForce 8600",
    },
    {
      title: "League of Legends",
      category: "MOBA",
      description: "League of Legends is a team-based game with over 140 champions to make epic plays with. Play for free now.",
      image_url: "https://cdn.cloudflare.steamstatic.com/steam/apps/2633200/header.jpg",
      is_featured: false,
      popularity: 95,
      min_specs: "Intel Core i3-530, 4GB RAM, NVIDIA GeForce 9600GT",
    },
    {
      title: "Valorant",
      category: "FPS",
      description: "Blend your style and experience on a global, competitive stage. You have 13 rounds to attack and defend your side using sharp gunplay and tactical abilities.",
      image_url: "https://cdn.cloudflare.steamstatic.com/steam/apps/2699310/header.jpg",
      is_featured: true,
      popularity: 92,
      min_specs: "Intel Core 2 Duo E8400, 4GB RAM, Intel HD 4000",
    },
    {
      title: "Apex Legends",
      category: "Battle Royale",
      description: "Conquer with character in Apex Legends, a free-to-play Hero shooter where legendary characters with powerful abilities team up to battle for fortune & fame.",
      image_url: "https://cdn.cloudflare.steamstatic.com/steam/apps/1172470/header.jpg",
      is_featured: false,
      popularity: 90,
      min_specs: "Intel Core i3 6300, 8GB RAM, NVIDIA GeForce GT 640",
    },
    {
      title: "PUBG: Battlegrounds",
      category: "Battle Royale",
      description: "Land on strategic locations, loot weapons and supplies, and survive to become the last team standing across various, diverse Battlegrounds.",
      image_url: "https://cdn.cloudflare.steamstatic.com/steam/apps/578080/header.jpg",
      is_featured: false,
      popularity: 87,
      min_specs: "Intel Core i5-4430, 8GB RAM, NVIDIA GeForce GTX 960 2GB",
    },
    {
      title: "Fortnite",
      category: "Battle Royale",
      description: "Create, play, and battle with friends for free in Fortnite. Be the last player standing in Battle Royale and Zero Build.",
      image_url: "https://cdn.cloudflare.steamstatic.com/steam/apps/1665460/header.jpg",
      is_featured: true,
      popularity: 93,
      min_specs: "Intel Core i3-3225, 4GB RAM, Intel HD 4000",
    },
    {
      title: "Forza Horizon 5",
      category: "Racing",
      description: "Your Ultimate Horizon Adventure awaits! Explore the vibrant and ever-evolving open world landscapes of Mexico with limitless, fun driving action.",
      image_url: "https://cdn.cloudflare.steamstatic.com/steam/apps/1551360/header.jpg",
      is_featured: true,
      popularity: 91,
      min_specs: "Intel i5-4460, 8GB RAM, NVidia GTX 970",
    },
    {
      title: "Need for Speed Heat",
      category: "Racing",
      description: "Hustle by day and risk it all by night in Need for Speed Heat, a white-knuckle street racer, where the lines of the law fade as the sun starts to set.",
      image_url: "https://cdn.cloudflare.steamstatic.com/steam/apps/1222680/header.jpg",
      is_featured: false,
      popularity: 84,
      min_specs: "Intel Core i5-3570, 8GB RAM, NVIDIA GeForce GTX 760",
    },
    {
      title: "FIFA 23",
      category: "Sports",
      description: "Experience the pinnacle of international football with the FIFA World Cup Qatar 2022 and FIFA Women's World Cup Australia and New Zealand 2023.",
      image_url: "https://cdn.cloudflare.steamstatic.com/steam/apps/2195250/header.jpg",
      is_featured: false,
      popularity: 88,
      min_specs: "Intel Core i5 6600k, 8GB RAM, NVIDIA GeForce GTX 1050 Ti",
    },
    {
      title: "NBA 2K24",
      category: "Sports",
      description: "Grab your squad and experience the past, present, and future of hoops culture in NBA 2K24. Enjoy pure, unadulterated action and limitless personalized MyPLAYER options.",
      image_url: "https://cdn.cloudflare.steamstatic.com/steam/apps/2338770/header.jpg",
      is_featured: false,
      popularity: 80,
      min_specs: "Intel Core i3-2100, 4GB RAM, NVIDIA GeForce GT 450",
    },
    {
      title: "StarCraft II",
      category: "Strategy",
      description: "Wage war across the galaxy with three unique and powerful races. StarCraft II is a sci-fi real-time strategy game.",
      image_url: "https://cdn.cloudflare.steamstatic.com/steam/apps/2816090/header.jpg",
      is_featured: false,
      popularity: 89,
      min_specs: "Intel Core i3, 4GB RAM, NVIDIA GeForce GTX 560",
    },
    {
      title: "Age of Empires IV",
      category: "Strategy",
      description: "One of the most beloved real-time strategy games returns to glory with Age of Empires IV, putting you at the center of epic historical battles that shaped the world.",
      image_url: "https://cdn.cloudflare.steamstatic.com/steam/apps/1466860/header.jpg",
      is_featured: false,
      popularity: 85,
      min_specs: "Intel Core i5-6300U, 8GB RAM, Intel HD 520",
    },
    {
      title: "World of Warcraft",
      category: "MMO",
      description: "Join thousands of mighty heroes in Azeroth, a world of magic and boundless adventure.",
      image_url: "https://cdn.cloudflare.steamstatic.com/steam/apps/2835570/header.jpg",
      is_featured: true,
      popularity: 90,
      min_specs: "Intel Core i5-3450, 8GB RAM, NVIDIA GeForce GTX 760",
    },
    {
      title: "Lost Ark",
      category: "MMO",
      description: "Embark on an odyssey for the Lost Ark in a vast, vibrant world: explore new lands, seek out lost treasures, and test yourself in thrilling action combat.",
      image_url: "https://cdn.cloudflare.steamstatic.com/steam/apps/1599340/header.jpg",
      is_featured: false,
      popularity: 86,
      min_specs: "Intel i3-3225, 8GB RAM, NVIDIA GeForce GTX 460",
    },
    {
      title: "Elden Ring",
      category: "RPG",
      description: "Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.",
      image_url: "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg",
      is_featured: true,
      popularity: 97,
      min_specs: "Intel Core i5-8400, 12GB RAM, NVIDIA GeForce GTX 1060 3GB",
    },
    {
      title: "Minecraft",
      category: "Strategy",
      description: "Explore infinite worlds and build everything from the simplest of homes to the grandest of castles.",
      image_url: "https://cdn.cloudflare.steamstatic.com/steam/apps/1672970/header.jpg",
      is_featured: false,
      popularity: 94,
      min_specs: "Intel Core i3-3210, 4GB RAM, Intel HD 4000",
    },
    {
      title: "Rocket League",
      category: "Sports",
      description: "Rocket League is a high-powered hybrid of arcade-style soccer and vehicular mayhem with easy-to-understand controls and fluid, physics-driven competition.",
      image_url: "https://cdn.cloudflare.steamstatic.com/steam/apps/252950/header.jpg",
      is_featured: false,
      popularity: 91,
      min_specs: "Intel Dual Core 2.5 GHz, 4GB RAM, NVIDIA GeForce GTX 760",
    },
  ];

  for (const game of gamesData) {
    const existing = await prisma.game.findFirst({
      where: {
        company_id: company.id,
        title: game.title,
      },
    });

    if (existing) {
      await prisma.game.update({
        where: { id: existing.id },
        data: game,
      });
    } else {
      await prisma.game.create({
        data: {
          company_id: company.id,
          ...game,
        },
      });
    }
  }
  console.log(`Seeded/Upserted ${gamesData.length} Games.`);

  // 4. Seed Products (Store Menu)
  const productsData = [
    // Drinks
    { name: "Coca-Cola 500ml",      category: "drinks", price: 2500,  description: "Cold carbonated soda",           available: true, image_url: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=300&auto=format&fit=crop" },
    { name: "Energy Drink (Red Bull)", category: "drinks", price: 5000, description: "Red Bull 250ml can",           available: true, image_url: "https://images.unsplash.com/photo-1622543956221-15bfae1d93a6?q=80&w=300&auto=format&fit=crop" },
    { name: "Monster Energy",       category: "drinks", price: 5000,  description: "Monster energy 500ml",           available: true, image_url: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=300&auto=format&fit=crop" },
    { name: "Water 500ml",          category: "drinks", price: 1000,  description: "Still mineral water",            available: true, image_url: "https://images.unsplash.com/photo-1616118132534-381148898bb4?q=80&w=300&auto=format&fit=crop" },
    { name: "Green Tea",            category: "drinks", price: 2000,  description: "Iced green tea bottle",          available: true, image_url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=300&auto=format&fit=crop" },
    { name: "Orange Juice",         category: "drinks", price: 3000,  description: "Fresh squeezed orange juice",    available: true, image_url: "https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=300&auto=format&fit=crop" },
    // Snacks
    { name: "Chips (Lay's Original)", category: "snacks", price: 2000, description: "Classic salted potato chips",  available: true, image_url: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?q=80&w=300&auto=format&fit=crop" },
    { name: "Chocolate Bar",        category: "snacks", price: 1500,  description: "Snickers 50g bar",               available: true, image_url: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?q=80&w=300&auto=format&fit=crop" },
    { name: "Popcorn (Butter)",     category: "snacks", price: 3000,  description: "Cinema-style buttered popcorn",  available: true, image_url: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?q=80&w=300&auto=format&fit=crop" },
    { name: "Nuts Mix",             category: "snacks", price: 3500,  description: "Mixed roasted nuts 100g",        available: true, image_url: "https://images.unsplash.com/photo-1534149791488-87ee7179ec6d?q=80&w=300&auto=format&fit=crop" },
    { name: "Gummy Bears",          category: "snacks", price: 2000,  description: "Haribo gummies 80g bag",         available: true, image_url: "https://images.unsplash.com/photo-1581798459219-318e76aecc7b?q=80&w=300&auto=format&fit=crop" },
    // Meals
    { name: "Beef Ramen Noodles",   category: "meals",  price: 8000,  description: "Hot cup noodles with beef broth", available: true, image_url: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=300&auto=format&fit=crop" },
    { name: "Fried Rice",           category: "meals",  price: 12000, description: "Egg fried rice with soy sauce",  available: true, image_url: "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=300&auto=format&fit=crop" },
    { name: "Hot Dog",              category: "meals",  price: 7000,  description: "Grilled sausage in bun",         available: true, image_url: "https://images.unsplash.com/photo-1619740455993-9e612b1af08a?q=80&w=300&auto=format&fit=crop" },
    { name: "Toast Sandwich",       category: "meals",  price: 8000,  description: "Ham and cheese toasted sandwich", available: true, image_url: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=300&auto=format&fit=crop" },
    // Combos
    { name: "Gamer Combo A",        category: "combo",  price: 10000, description: "Any drink + chips + chocolate",  available: true, image_url: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?q=80&w=300&auto=format&fit=crop" },
    { name: "Gamer Combo B",        category: "combo",  price: 18000, description: "Energy drink + ramen + snack",   available: true, image_url: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?q=80&w=300&auto=format&fit=crop" },
    { name: "Pro Gamer Meal",       category: "combo",  price: 22000, description: "Fried rice + energy drink + nuts", available: true, image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300&auto=format&fit=crop" },
  ];

  for (const product of productsData) {
    const existing = await prisma.product.findFirst({
      where: { company_id: company.id, name: product.name },
    });
    if (existing) {
      await prisma.product.update({ where: { id: existing.id }, data: product });
    } else {
      await prisma.product.create({ data: { company_id: company.id, ...product } });
    }
  }
  console.log(`Seeded/Upserted ${productsData.length} Products.`);

  // 5. Seed UserProfiles
  const userProfilesData = [
    {
      user_id:        "admin-user",
      username:       "GamerAdmin",
      balance:        50000,
      points:         3200,
      rank:           "Gold",
      total_hours:    142.5,
      current_pc:     5,
      session_active: true,
      session_start:  new Date(Date.now() - 90 * 60 * 1000).toISOString(), // 90 mins ago
    },
    {
      user_id:        "player-002",
      username:       "NightHawk_MN",
      balance:        15000,
      points:         820,
      rank:           "Silver",
      total_hours:    58.0,
      current_pc:     null,
      session_active: false,
      session_start:  null,
    },
    {
      user_id:        "player-003",
      username:       "CS2_Pro",
      balance:        80000,
      points:         8500,
      rank:           "Platinum",
      total_hours:    310.0,
      current_pc:     8,
      session_active: true,
      session_start:  new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    },
    {
      user_id:        "player-004",
      username:       "ShadowByte",
      balance:        5000,
      points:         150,
      rank:           "Bronze",
      total_hours:    12.5,
      current_pc:     null,
      session_active: false,
      session_start:  null,
    },
  ];

  for (const profile of userProfilesData) {
    const existing = await prisma.userProfile.findFirst({
      where: { company_id: company.id, user_id: profile.user_id },
    });
    if (existing) {
      await prisma.userProfile.update({ where: { id: existing.id }, data: profile });
    } else {
      await prisma.userProfile.create({ data: { company_id: company.id, ...profile } });
    }
  }
  console.log(`Seeded/Upserted ${userProfilesData.length} User Profiles.`);

  // 6. Seed Tournaments
  const tournamentsData = [
    {
      title: "NEXUS CS2 LAN CUP #1",
      game: "Counter-Strike 2",
      prize_pool: "₮5,000,000",
      entry_fee: 0,
      status: "upcoming",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      time: "14:00",
      max_participants: 32,
      current_participants: 12,
      description: "Тэмцээний систем: Single Elimination. Бүртгэлийн хугацаа 7-р сарын 5 хүртэл үргэлжилнэ. Бүх тоглолт NEXUS салбарын VIP компьютерүүд дээр явагдана.",
      image_url: "https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg",
    },
    {
      title: "DOTA 2 1v1 MID CHAMPIONSHIP",
      game: "Dota 2",
      prize_pool: "₮1,500,000",
      entry_fee: 5000,
      status: "active",
      date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      time: "18:00",
      max_participants: 16,
      current_participants: 16,
      description: "SF Only. Runes, Bottles, Infused Raindrops зөвшөөрөгдөнө. 2 Kill эсвэл 1 Tower авсан тоглогч хожно.",
      image_url: "https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg",
    },
    {
      title: "VALORANT SHOWDOWN 5v5",
      game: "Valorant",
      prize_pool: "₮3,000,000",
      entry_fee: 10000,
      status: "completed",
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      time: "16:00",
      max_participants: 8,
      current_participants: 8,
      description: "Монголын шилдэг Valorant багуудын цуврал тэмцээн. Түрүүлсэн баг: Team Mongolia Esports.",
      image_url: "https://cdn.cloudflare.steamstatic.com/steam/apps/2699310/header.jpg",
    },
    {
      title: "PUBG SQUADS INVITATIONAL",
      game: "PUBG: Battlegrounds",
      prize_pool: "₮2,000,000",
      entry_fee: 8000,
      status: "upcoming",
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      time: "19:00",
      max_participants: 20,
      current_participants: 5,
      description: "4-н хүний баг. Эцсийн 20 баг амьд үлдсэн эсэхийг тодорхойлно. Мэргэн буудагч хамгийн их kill авсан баг нэмэлт шагнал авна.",
      image_url: "https://cdn.cloudflare.steamstatic.com/steam/apps/578080/header.jpg",
    },
  ];

  for (const tour of tournamentsData) {
    const existing = await prisma.tournament.findFirst({
      where: { company_id: company.id, title: tour.title },
    });
    if (existing) {
      await prisma.tournament.update({ where: { id: existing.id }, data: tour });
    } else {
      await prisma.tournament.create({ data: { company_id: company.id, ...tour } });
    }
  }
  console.log(`Seeded/Upserted ${tournamentsData.length} Tournaments.`);

  console.log("Database seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

