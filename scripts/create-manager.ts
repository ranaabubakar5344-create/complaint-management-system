import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined");
}

const url = new URL(databaseUrl);

const adapter = new PrismaMariaDb({
  host: url.hostname,
  port: Number(url.port || 3306),
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: url.pathname.replace("/", ""),
  connectionLimit: 5,
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
  console.log(manager.email);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  })



  