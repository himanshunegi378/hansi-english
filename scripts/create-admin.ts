import bcrypt from "bcryptjs";
import { PrismaClient } from "../generated/prisma/client";
import { Role } from "../generated/prisma/enums";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString = `${process.env.DATABASE_URL}`;

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function createAdmin() {
  const args = process.argv.slice(2);
  
  if (args.includes("--help") || args.includes("-h")) {
    console.log(`
Usage: npx tsx scripts/create-admin.ts <email> <password> <name>

Arguments:
  email     The email of the admin to create (default: admin@example.com)
  password  The password of the admin (default: admin123)
  name      The name of the admin (default: Admin User)

Example:
  npx tsx scripts/create-admin.ts supervisor@hansi.com superSecret123 "Hansi Supervisor"
    `);
    return;
  }

  const email = args[0] ?? "admin@example.com";
  const password = args[1] ?? "admin123";
  const name = args[2] ?? "Admin User";

  console.log(`Creating admin with email: ${email}...`);

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const admin = await (prisma as any).user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: Role.ADMIN,
      },
    });
    console.log(`Successfully created admin: ${admin.email}`);
  } catch (error: any) {
    if (error.code === 'P2002') {
      console.error(`Error: User with email ${email} already exists.`);
    } else {
      console.error("Error creating admin:", error);
    }
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

createAdmin().catch(console.error);
