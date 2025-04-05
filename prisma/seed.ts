import { PrismaClient } from "@prisma/client";
import { scryptSync, randomBytes } from "crypto"; // Import scrypt and randomBytes for hashing

const prisma = new PrismaClient();

async function main() {
  const salt = randomBytes(16).toString("hex");
  const hashedPassword = scryptSync("#readosphere@5678#", salt, 64).toString(
    "hex"
  );
  const passwordToStore = `${salt}:${hashedPassword}`;

  const admin = await prisma.user.create({
    data: {
      email: "admin@readosphere.com",
      name: "Readosphere",
      password: passwordToStore,
    },
  });

  // Create categories
  const categories = await prisma.category.createMany({
    data: [
      { name: "Self Improvement", description: "Books that help you grow." },
      { name: "Science Fiction", description: "Explore futuristic worlds." },
      { name: "Philosophy", description: "Deep thoughts and reflections." },
      { name: "Psychology", description: "Understand the human mind." },
      { name: "Biographies", description: "Stories of inspiring lives." },
    ],
  });

  const allCategories = await prisma.category.findMany();

  // Create posts
  await prisma.post.createMany({
    data: [
      {
        slug: "atomic-habits-summary",
        title: "Atomic Habits Summary",
        metaTitle: "Atomic Habits Book Summary",
        metaDescription: "Key takeaways from Atomic Habits by James Clear",
        metaTags: "habits, productivity, james clear",
        content:
          "Atomic Habits is a powerful book about tiny changes creating big results.",
        userId: admin.id,
        categoryId: allCategories.find((c) => c.name === "Self Improvement")
          ?.id,
        thumbnail: null,
        published: true,
      },
      {
        slug: "dune-overview",
        title: "Dune: A Sci-Fi Classic",
        metaTitle: "Dune Book Overview",
        metaDescription:
          "Exploring Frank Herbert's legendary science fiction saga.",
        metaTags: "dune, sci-fi, space",
        content:
          "Dune is a story about politics, religion, and survival in a desert world.",
        userId: admin.id,
        categoryId: allCategories.find((c) => c.name === "Science Fiction")?.id,
        thumbnail: null,
        published: true,
      },
    ],
  });

  // Create recommendations
  await prisma.recommendation.createMany({
    data: [
      {
        name: "Deep Work",
        description:
          "A guide to focused success in a distracted world by Cal Newport.",
        link: "https://www.goodreads.com/book/show/25744928-deep-work",
        imageUrl:
          "https://5.imimg.com/data5/SELLER/Default/2020/9/YS/FJ/XX/26798013/book-covers-designing-service.jpg",
      },
      {
        name: "Man's Search for Meaning",
        description: "A powerful memoir by Viktor E. Frankl.",
        link: "https://www.goodreads.com/book/show/4069.Man_s_Search_for_Meaning",
        imageUrl:
          "https://5.imimg.com/data5/SELLER/Default/2020/9/YS/FJ/XX/26798013/book-covers-designing-service.jpg",
      },
      {
        name: "The Power of Now",
        description:
          "Spiritual enlightenment through present moment awareness.",
        link: "https://www.goodreads.com/book/show/6708.The_Power_of_Now",
        imageUrl:
          "https://marketplace.canva.com/EAFfSnGl7II/2/0/1003w/canva-elegant-dark-woods-fantasy-photo-book-cover-vAt8PH1CmqQ.jpg",
      },
    ],
  });

  console.log("✅ Seed completed!");
}

main()
  .catch((error) => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
