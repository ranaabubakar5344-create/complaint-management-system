import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({
  connectionString: databaseUrl,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const email = "manager@company.com";
  const password = "ChangeMe123!";

  const passwordHash = await bcrypt.hash(password, 12);

  const manager = await prisma.manager.upsert({
    where: {
      email,
    },
    update: {
      passwordHash,
    },
    create: {
      name: "Manager",
      email,
      passwordHash,
    },
  });

  console.log("Manager created successfully:");
  console.log({
    id: manager.id,
    name: manager.name,
    email: manager.email,
  });
}

main()
  .catch((error) => {
    console.error("Manager creation failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });