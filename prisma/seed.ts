import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clean slate
  await prisma.booking.deleteMany();
  await prisma.room.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.user.deleteMany();

  // Users
  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("user123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@hotel.com",
      password: adminPassword,
      role: "ADMIN",
      phone: "+201000000000",
    },
  });

  const user = await prisma.user.create({
    data: {
      name: "Yusi Test",
      email: "user@hotel.com",
      password: userPassword,
      role: "USER",
      phone: "+201111111111",
    },
  });

  // Hotels + Rooms
  const hiltonCairo = await prisma.hotel.create({
    data: {
      name: "Hilton Cairo Nile",
      description: "Luxury riverside hotel with skyline views and a rooftop pool.",
      city: "Cairo",
      location: "Nile Corniche, Cairo",
      rating: 4.6,
      images: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945",
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
      ],
      amenities: ["Wi-Fi", "Swimming Pool", "Parking", "Restaurant", "Gym"],
      rooms: {
        create: [
          {
            type: "Deluxe Double Room",
            description: "Spacious room with king bed and Nile view.",
            pricePerNight: 100,
            capacity: 2,
            bedType: "1 King Bed",
            sizeSqm: 35,
            amenities: ["Wi-Fi", "Breakfast included", "Air Conditioning"],
            images: ["https://images.unsplash.com/photo-1611892440504-42a792e24d32"],
            totalRooms: 5,
          },
          {
            type: "Executive Suite",
            description: "Suite with separate living area and premium amenities.",
            pricePerNight: 180,
            capacity: 3,
            bedType: "1 King Bed + Sofa Bed",
            sizeSqm: 55,
            amenities: ["Wi-Fi", "Breakfast included", "Minibar", "City View"],
            images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427"],
            totalRooms: 3,
          },
        ],
      },
    },
  });

  const marriottAlex = await prisma.hotel.create({
    data: {
      name: "Marriott Alexandria Bay",
      description: "Beachfront hotel with direct access to the Mediterranean.",
      city: "Alexandria",
      location: "Corniche Road, Alexandria",
      rating: 4.3,
      images: [
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
      ],
      amenities: ["Wi-Fi", "Beach Access", "Parking", "Restaurant", "Spa"],
      rooms: {
        create: [
          {
            type: "Standard Twin Room",
            description: "Comfortable room with two single beds, sea view.",
            pricePerNight: 70,
            capacity: 2,
            bedType: "2 Single Beds",
            sizeSqm: 28,
            amenities: ["Wi-Fi", "Sea View"],
            images: ["https://images.unsplash.com/photo-1595576508898-0ad5c879a061"],
            totalRooms: 8,
          },
          {
            type: "Family Room",
            description: "Large room ideal for families, with extra bedding.",
            pricePerNight: 130,
            capacity: 4,
            bedType: "2 Queen Beds",
            sizeSqm: 45,
            amenities: ["Wi-Fi", "Breakfast included", "Balcony"],
            images: ["https://images.unsplash.com/photo-1598928506311-c55ded91a20c"],
            totalRooms: 4,
          },
        ],
      },
    },
  });

  const redSeaResort = await prisma.hotel.create({
    data: {
      name: "Red Sea Grand Resort",
      description: "All-inclusive resort with private beach and diving center.",
      city: "Hurghada",
      location: "Red Sea Coast, Hurghada",
      rating: 4.8,
      images: [
        "https://images.unsplash.com/photo-1582719508461-905c673771fd",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
      ],
      amenities: ["Wi-Fi", "Swimming Pool", "Beach Access", "Restaurant", "Diving Center", "Gym"],
      rooms: {
        create: [
          {
            type: "Ocean View Room",
            description: "Room with direct ocean views and private balcony.",
            pricePerNight: 150,
            capacity: 2,
            bedType: "1 King Bed",
            sizeSqm: 40,
            amenities: ["Wi-Fi", "All-Inclusive", "Balcony", "Ocean View"],
            images: ["https://images.unsplash.com/photo-1611892440504-42a792e24d32"],
            totalRooms: 6,
          },
        ],
      },
    },
  });

  console.log("Seed complete:");
  console.log(`  Admin: admin@hotel.com / admin123`);
  console.log(`  User:  user@hotel.com / user123`);
  console.log(`  Hotels: ${hiltonCairo.name}, ${marriottAlex.name}, ${redSeaResort.name}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });