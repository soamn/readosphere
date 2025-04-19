import { PrismaClient } from "@prisma/client";
import { scryptSync, randomBytes } from "crypto"; // Import scrypt and randomBytes for hashing

const prisma = new PrismaClient();

async function main() {
  // const salt = randomBytes(16).toString("hex");
  // const hashedPassword = scryptSync("#readosphere@5678#", salt, 64).toString(
  //   "hex"
  // );
  // const passwordToStore = `${salt}:${hashedPassword}`;

  // const admin = await prisma.user.create({
  //   data: {
  //     email: "admin@readosphere.com",
  //     name: "Readosphere",
  //     password: passwordToStore,
  //   },
  // });
  await prisma.homepage.upsert({
    where: { id: 1 }, // use a known unique identifier
    update: {}, // no update
    create: {
      id: 1, // must be a unique field (e.g., `id`, `slug`, etc.)
      heroText1: "Welcome to our site",
      heroText2: "Discover something new",
      heroImage: "hero.jpg",
      featuredText1: "Each word holds",
      featuredText2: "a story",
      smallparagraph: "Crafted with care and built for you.",
      aboutheading: "About Us",
      aboutparagraph: "We’re a creative team building awesome things.",
      featuredImage: "featured.jpg",
    },
  });
}

main()
  .catch((error) => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
