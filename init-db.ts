import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./drizzle/schema";

const sqlite = new Database("zenga.db");
sqlite.pragma("journal_mode = WAL");

const db = drizzle(sqlite, { schema });

// Create tables
console.log("Initializing database...");

try {
  // Users table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      openId TEXT UNIQUE,
      name TEXT,
      email TEXT UNIQUE,
      loginMethod TEXT,
      passwordHash TEXT,
      role TEXT NOT NULL DEFAULT 'user',
      createdAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      updatedAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      lastSignedIn INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
    );
  `);

  // Projects table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      category TEXT NOT NULL,
      shortDescription TEXT,
      fullDescription TEXT,
      thumbnail TEXT,
      gallery TEXT,
      videoUrl TEXT,
      director TEXT,
      camera TEXT,
      duration TEXT,
      year INTEGER,
      crew TEXT,
      status TEXT NOT NULL DEFAULT 'draft',
      sortOrder INTEGER DEFAULT 0,
      isFeatured INTEGER DEFAULT 0,
      createdAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      updatedAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
    );
  `);

  // Coming soon projects table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS coming_soon_projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      teaserImage TEXT,
      teaserVideo TEXT,
      description TEXT,
      releaseDate INTEGER,
      isActive INTEGER DEFAULT 1,
      sortOrder INTEGER DEFAULT 0,
      createdAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      updatedAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
    );
  `);

  // Email subscribers table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS email_subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      subscribedAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      isActive INTEGER DEFAULT 1
    );
  `);

  // Team members table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS team_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      position TEXT NOT NULL,
      department TEXT NOT NULL,
      photo TEXT,
      shortBio TEXT,
      fullBio TEXT,
      linkedinUrl TEXT,
      imdbUrl TEXT,
      sortOrder INTEGER DEFAULT 0,
      isActive INTEGER DEFAULT 1,
      createdAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      updatedAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
    );
  `);

  // Organization positions table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS org_positions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      name TEXT,
      department TEXT,
      parentId INTEGER,
      photo TEXT,
      bio TEXT,
      sortOrder INTEGER DEFAULT 0,
      createdAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      updatedAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
    );
  `);

  // About content table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS about_content (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      section TEXT NOT NULL UNIQUE,
      title TEXT,
      content TEXT,
      image TEXT,
      updatedAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
    );
  `);

  // Company values table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS company_values (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      sortOrder INTEGER DEFAULT 0,
      createdAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
    );
  `);

  // Achievements table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS achievements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      year INTEGER NOT NULL,
      type TEXT DEFAULT 'milestone',
      sortOrder INTEGER DEFAULT 0,
      createdAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
    );
  `);

  // Partners table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS partners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      logo TEXT,
      website TEXT,
      sortOrder INTEGER DEFAULT 0,
      isActive INTEGER DEFAULT 1,
      createdAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
    );
  `);

  // Contact messages table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      projectType TEXT,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'unread',
      createdAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      updatedAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
    );
  `);

  // Site settings table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS site_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      settingKey TEXT NOT NULL UNIQUE,
      settingValue TEXT,
      updatedAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
    );
  `);

  // Contact info table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS contact_info (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      address TEXT,
      phone TEXT,
      email TEXT,
      mapLat TEXT,
      mapLng TEXT,
      facebook TEXT,
      instagram TEXT,
      twitter TEXT,
      youtube TEXT,
      linkedin TEXT,
      updatedAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
    );
  `);

  console.log("✓ Database initialized successfully!");
  console.log("✓ All tables created!");
  
  sqlite.close();
  process.exit(0);
} catch (error) {
  console.error("✗ Failed to initialize database:", error);
  sqlite.close();
  process.exit(1);
}
