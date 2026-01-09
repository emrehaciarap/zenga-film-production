import * as db from "../server/db";
import bcrypt from "bcrypt";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

async function createAdmin() {
  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !password) {
    console.error("Usage: pnpm exec tsx scripts/create-admin.ts <email> <password>");
    console.error("Example: pnpm exec tsx scripts/create-admin.ts admin@example.com mypassword123");
    process.exit(1);
  }

  try {
    console.log(`Creating admin user with email: ${email}`);
    
    // Connect to SQLite database
    const sqlite = new Database("zenga.db");
    sqlite.pragma("journal_mode = WAL");
    const drizzleDb = drizzle(sqlite);

    // Check if user already exists
    const existing = await drizzleDb.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing.length > 0) {
      console.error("✗ User with this email already exists");
      sqlite.close();
      process.exit(1);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    const openId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create user
    await drizzleDb.insert(users).values({
      openId,
      email,
      passwordHash,
      name: email.split('@')[0],
      loginMethod: 'email',
      role: 'admin',
      lastSignedIn: new Date(),
    });

    console.log("✓ Admin user created successfully!");
    console.log(`  Email: ${email}`);
    console.log(`  Name: ${email.split('@')[0]}`);
    console.log(`  Role: admin`);
    
    sqlite.close();
    process.exit(0);
  } catch (error) {
    console.error("✗ Failed to create admin user:");
    console.error(String(error));
    process.exit(1);
  }
}

createAdmin();
