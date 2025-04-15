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

}

main()
  .catch((error) => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
