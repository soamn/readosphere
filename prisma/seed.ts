import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.homepage.findFirst({
    where: { id: 1 }, // change 'id' logic as per your schema
  });

  if (existing) {
    console.log("⚠️ Homepage seed already exists. Skipping insert.");
    return;
  }

  await prisma.homepage.create({
    data: {
      id: 1,
      heroText1: "Welcome to the site",
      heroText2: "Uncover stories",
      heroImage: "hero-1745070056699.jpg",
      featuredText1: "Each word holds",
      featuredText2: "a story",
      smallparagraph: "This site is made with design in mind.",
      aboutheading: "About Us",
      aboutparagraph: "We create impactful digital experiences.",
      featuredImage: "featured-1745070056699.jpg",
    },
  });

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((err) => {
    console.error("❌ Error while seeding:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
