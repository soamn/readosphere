import { Category, PrismaClient } from "@prisma/client";
import crypto, { randomBytes } from "crypto";
import { promisify } from "util";

const prisma = new PrismaClient();

const scrypt = promisify(crypto.scrypt);

async function createUser() {
  const salt = randomBytes(16).toString("hex");
  const hashBuffer = (await scrypt(
    `${process.env.ADMIN_PASS}`,
    salt,
    64
  )) as Buffer;
  const storedPassword = `${salt}:${hashBuffer.toString("hex")}`;

  await prisma.user.create({
    data: {
      name: "Admin",
      email: `${process.env.ADMIN_ID}`,
      password: storedPassword,
    },
  });

  console.log("User created with scrypt-hashed password!");
}
async function main() {
  createUser();
  const existing = await prisma.homepage.findFirst({
    where: { id: 1 },
  });

  if (existing) {
    console.log("⚠️ Homepage seed already exists. Skipping insert.");
    return;
  }

  await prisma.homepage.create({
    data: {
      id: 1,
      heroText1: "Rediscover the",
      heroText2: "Beauty of Reading",
      heroImage: `${process.env.NEXT_PUBLIC_API_URL}/hero-1745070056699.jpg`,
      featuredImage: `${process.env.NEXT_PUBLIC_API_URL}/featured-1745070056699.jpg`,
      featuredText1: "Each word holds",
      featuredText2: "a story",
      smallparagraph:
        "Inviting you to Immense Yourself in the rich tapestry of words...",
      aboutheading: "Stories told, softly",
      aboutparagraph: `<p dir="ltr"><span style="white-space: pre-wrap;">In a world that's always-scrolling, responding,and connecting,</span></p><p dir="ltr"><span style="white-space: pre-wrap;">I longed for a space that moved slower. A long-awaited corner of my imagination</span></p><p dir="ltr"><span style="white-space: pre-wrap;"> -one that has been inside from my childhood, where stories once bloomed, and still do.</span></p><p><br></p><p dir="ltr"><span style="white-space: pre-wrap;">This is my way of gently weaving together the three companions that have always grounded me:</span></p><p dir="ltr"><b><strong class="font-bold" style="white-space: pre-wrap;">nature,books,and the calm </strong></b><i><em class="italic" style="white-space: pre-wrap;">(that I still continue to chase).</em></i></p>`,
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
