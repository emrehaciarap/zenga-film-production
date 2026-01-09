import { int, text, sqliteTable, integer, real, unique } from "drizzle-orm/sqlite-core";

/**
 * Core user table backing auth flow.
 */
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  openId: text("openId").unique(),
  name: text("name"),
  email: text("email").unique(),
  loginMethod: text("loginMethod"),
  passwordHash: text("passwordHash"),
  role: text("role", { enum: ["user", "admin"] }).default("user").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).defaultNow().notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).defaultNow().notNull(),
  lastSignedIn: integer("lastSignedIn", { mode: "timestamp" }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Projects table - Film, Reklam, Belgesel, Müzik Video
 */
export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  category: text("category", { enum: ["film", "reklam", "belgesel", "muzik_video"] }).notNull(),
  shortDescription: text("shortDescription"),
  fullDescription: text("fullDescription"),
  thumbnail: text("thumbnail"),
  gallery: text("gallery", { mode: "json" }).$type<string[]>(),
  videoUrl: text("videoUrl"),
  director: text("director"),
  camera: text("camera"),
  duration: text("duration"),
  year: integer("year"),
  crew: text("crew"),
  status: text("status", { enum: ["active", "coming_soon", "draft"] }).default("draft").notNull(),
  sortOrder: integer("sortOrder").default(0),
  isFeatured: integer("isFeatured", { mode: "boolean" }).default(false),
  createdAt: integer("createdAt", { mode: "timestamp" }).defaultNow().notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).defaultNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

/**
 * Coming Soon Projects - Pek Yakında
 */
export const comingSoonProjects = sqliteTable("coming_soon_projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  teaserImage: text("teaserImage"),
  teaserVideo: text("teaserVideo"),
  description: text("description"),
  releaseDate: integer("releaseDate", { mode: "timestamp" }),
  isActive: integer("isActive", { mode: "boolean" }).default(true),
  sortOrder: integer("sortOrder").default(0),
  createdAt: integer("createdAt", { mode: "timestamp" }).defaultNow().notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).defaultNow().notNull(),
});

export type ComingSoonProject = typeof comingSoonProjects.$inferSelect;
export type InsertComingSoonProject = typeof comingSoonProjects.$inferInsert;

/**
 * Email subscribers for coming soon notifications
 */
export const emailSubscribers = sqliteTable("email_subscribers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  subscribedAt: integer("subscribedAt", { mode: "timestamp" }).defaultNow().notNull(),
  isActive: integer("isActive", { mode: "boolean" }).default(true),
});

export type EmailSubscriber = typeof emailSubscribers.$inferSelect;
export type InsertEmailSubscriber = typeof emailSubscribers.$inferInsert;

/**
 * Team members - Ekibimiz
 */
export const teamMembers = sqliteTable("team_members", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  position: text("position").notNull(),
  department: text("department", { enum: ["yonetim", "kreatif", "produksiyon", "teknik"] }).notNull(),
  photo: text("photo"),
  shortBio: text("shortBio"),
  fullBio: text("fullBio"),
  linkedinUrl: text("linkedinUrl"),
  imdbUrl: text("imdbUrl"),
  sortOrder: integer("sortOrder").default(0),
  isActive: integer("isActive", { mode: "boolean" }).default(true),
  createdAt: integer("createdAt", { mode: "timestamp" }).defaultNow().notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).defaultNow().notNull(),
});

export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = typeof teamMembers.$inferInsert;

/**
 * Organization chart positions
 */
export const orgPositions = sqliteTable("org_positions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  name: text("name"),
  department: text("department"),
  parentId: integer("parentId"),
  photo: text("photo"),
  bio: text("bio"),
  sortOrder: integer("sortOrder").default(0),
  createdAt: integer("createdAt", { mode: "timestamp" }).defaultNow().notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).defaultNow().notNull(),
});

export type OrgPosition = typeof orgPositions.$inferSelect;
export type InsertOrgPosition = typeof orgPositions.$inferInsert;

/**
 * About page content sections
 */
export const aboutContent = sqliteTable("about_content", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  section: text("section", { enum: ["vision", "mission", "story", "values"] }).notNull().unique(),
  title: text("title"),
  content: text("content"),
  image: text("image"),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).defaultNow().notNull(),
});

export type AboutContent = typeof aboutContent.$inferSelect;
export type InsertAboutContent = typeof aboutContent.$inferInsert;

/**
 * Company values
 */
export const companyValues = sqliteTable("company_values", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  icon: text("icon"),
  sortOrder: integer("sortOrder").default(0),
  createdAt: integer("createdAt", { mode: "timestamp" }).defaultNow().notNull(),
});

export type CompanyValue = typeof companyValues.$inferSelect;
export type InsertCompanyValue = typeof companyValues.$inferInsert;

/**
 * Achievements and awards timeline
 */
export const achievements = sqliteTable("achievements", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  year: integer("year").notNull(),
  type: text("type", { enum: ["award", "milestone"] }).default("milestone"),
  sortOrder: integer("sortOrder").default(0),
  createdAt: integer("createdAt", { mode: "timestamp" }).defaultNow().notNull(),
});

export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = typeof achievements.$inferInsert;

/**
 * Partner/client references
 */
export const partners = sqliteTable("partners", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  logo: text("logo"),
  website: text("website"),
  sortOrder: integer("sortOrder").default(0),
  isActive: integer("isActive", { mode: "boolean" }).default(true),
  createdAt: integer("createdAt", { mode: "timestamp" }).defaultNow().notNull(),
});

export type Partner = typeof partners.$inferSelect;
export type InsertPartner = typeof partners.$inferInsert;

/**
 * Contact form messages
 */
export const contactMessages = sqliteTable("contact_messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  projectType: text("projectType", { enum: ["film", "reklam", "belgesel", "muzik_video", "diger"] }),
  message: text("message").notNull(),
  status: text("status", { enum: ["unread", "read", "replied", "archived"] }).default("unread").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).defaultNow().notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).defaultNow().notNull(),
});

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = typeof contactMessages.$inferInsert;

/**
 * Site settings
 */
export const siteSettings = sqliteTable("site_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  settingKey: text("settingKey").notNull().unique(),
  settingValue: text("settingValue"),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).defaultNow().notNull(),
});

export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = typeof siteSettings.$inferInsert;

/**
 * Contact information
 */
export const contactInfo = sqliteTable("contact_info", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  address: text("address"),
  phone: text("phone"),
  email: text("email"),
  mapLat: text("mapLat"),
  mapLng: text("mapLng"),
  facebook: text("facebook"),
  instagram: text("instagram"),
  twitter: text("twitter"),
  youtube: text("youtube"),
  linkedin: text("linkedin"),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).defaultNow().notNull(),
});

export type ContactInfo = typeof contactInfo.$inferSelect;
export type InsertContactInfo = typeof contactInfo.$inferInsert;
