import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { 
  InsertUser, users,
  projects, InsertProject, Project,
  comingSoonProjects, InsertComingSoonProject,
  emailSubscribers, InsertEmailSubscriber,
  teamMembers, InsertTeamMember,
  orgPositions, InsertOrgPosition,
  aboutContent, InsertAboutContent,
  companyValues, InsertCompanyValue,
  achievements, InsertAchievement,
  partners, InsertPartner,
  contactMessages, InsertContactMessage,
  siteSettings, InsertSiteSetting,
  contactInfo, InsertContactInfo
} from "../drizzle/schema";
import { ENV } from './_core/env';
import bcrypt from 'bcrypt';
import { eq, desc, asc, and } from "drizzle-orm";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db) {
    try {
      const sqlite = new Database("zenga.db");
      sqlite.pragma("journal_mode = WAL");
      _db = drizzle(sqlite);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ==================== USER FUNCTIONS ====================
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    const existing = await db.select().from(users).where(eq(users.openId, user.openId)).limit(1);
    if (existing.length > 0) {
      await db.update(users).set(updateSet).where(eq(users.openId, user.openId));
    } else {
      await db.insert(users).values(values);
    }
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createUserWithPassword(email: string, password: string, name?: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const openId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const user: InsertUser = {
    openId,
    email,
    passwordHash,
    name: name || email.split('@')[0],
    loginMethod: 'email',
    role: 'admin',
    lastSignedIn: new Date(),
  };

  await db.insert(users).values(user);
  return user;
}

export async function verifyUserPassword(email: string, password: string) {
  const user = await getUserByEmail(email);
  if (!user || !user.passwordHash) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    return null;
  }

  return user;
}

// ==================== PROJECTS FUNCTIONS ====================
export async function getAllProjects(status?: 'active' | 'coming_soon' | 'draft') {
  const db = await getDb();
  if (!db) return [];
  
  if (status) {
    return db.select().from(projects).where(eq(projects.status, status)).orderBy(asc(projects.sortOrder));
  }
  return db.select().from(projects).orderBy(asc(projects.sortOrder));
}

export async function getProjectsByCategory(category: 'film' | 'reklam' | 'belgesel' | 'muzik_video') {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(projects)
    .where(and(eq(projects.category, category), eq(projects.status, 'active')))
    .orderBy(asc(projects.sortOrder));
}

export async function getFeaturedProjects() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(projects)
    .where(and(eq(projects.isFeatured, true), eq(projects.status, 'active')))
    .orderBy(asc(projects.sortOrder))
    .limit(3);
}

export async function getProjectBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
  return result[0];
}

export async function getProjectById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  return result[0];
}

export async function createProject(project: InsertProject) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(projects).values(project);
  return result;
}

export async function updateProject(id: number, data: Partial<InsertProject>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(projects).set(data).where(eq(projects.id, id));
  return getProjectById(id);
}

export async function deleteProject(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(projects).where(eq(projects.id, id));
  return { success: true };
}

// ==================== COMING SOON PROJECTS ====================
export async function getComingSoonProjects() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(comingSoonProjects)
    .where(eq(comingSoonProjects.isActive, true))
    .orderBy(asc(comingSoonProjects.sortOrder));
}

export async function getAllComingSoonProjects() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(comingSoonProjects).orderBy(asc(comingSoonProjects.sortOrder));
}

export async function createComingSoonProject(project: InsertComingSoonProject) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(comingSoonProjects).values(project);
}

export async function updateComingSoonProject(id: number, data: Partial<InsertComingSoonProject>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(comingSoonProjects).set(data).where(eq(comingSoonProjects.id, id));
  return db.select().from(comingSoonProjects).where(eq(comingSoonProjects.id, id)).limit(1);
}

export async function deleteComingSoonProject(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(comingSoonProjects).where(eq(comingSoonProjects.id, id));
  return { success: true };
}

export async function subscribeEmail(email: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await db.select().from(emailSubscribers).where(eq(emailSubscribers.email, email)).limit(1);
  if (existing.length > 0) {
    return existing[0];
  }
  
  return db.insert(emailSubscribers).values({ email });
}

export async function getAllSubscribers() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(emailSubscribers);
}

// ==================== TEAM MEMBERS ====================
export async function getTeamMembers(department?: string) {
  const db = await getDb();
  if (!db) return [];
  
  if (department) {
    return db.select().from(teamMembers)
      .where(and(eq(teamMembers.department, department as any), eq(teamMembers.isActive, true)))
      .orderBy(asc(teamMembers.sortOrder));
  }
  
  return db.select().from(teamMembers)
    .where(eq(teamMembers.isActive, true))
    .orderBy(asc(teamMembers.sortOrder));
}

export async function getAllTeamMembers() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(teamMembers).orderBy(asc(teamMembers.sortOrder));
}

export async function createTeamMember(member: InsertTeamMember) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(teamMembers).values(member);
}

export async function updateTeamMember(id: number, data: Partial<InsertTeamMember>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(teamMembers).set(data).where(eq(teamMembers.id, id));
  return db.select().from(teamMembers).where(eq(teamMembers.id, id)).limit(1);
}

export async function deleteTeamMember(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(teamMembers).where(eq(teamMembers.id, id));
  return { success: true };
}

// ==================== ORG POSITIONS ====================
export async function getOrgPositions() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(orgPositions).orderBy(asc(orgPositions.sortOrder));
}

export async function createOrgPosition(position: InsertOrgPosition) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(orgPositions).values(position);
}

export async function updateOrgPosition(id: number, data: Partial<InsertOrgPosition>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(orgPositions).set(data).where(eq(orgPositions.id, id));
  return db.select().from(orgPositions).where(eq(orgPositions.id, id)).limit(1);
}

export async function deleteOrgPosition(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(orgPositions).where(eq(orgPositions.id, id));
  return { success: true };
}

// ==================== ABOUT CONTENT ====================
export async function getAboutContent() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(aboutContent);
}

export async function upsertAboutContent(data: InsertAboutContent) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await db.select().from(aboutContent).where(eq(aboutContent.section, data.section)).limit(1);
  if (existing.length > 0) {
    await db.update(aboutContent).set(data).where(eq(aboutContent.section, data.section));
    return existing[0];
  }
  
  return db.insert(aboutContent).values(data);
}

// ==================== COMPANY VALUES ====================
export async function getCompanyValues() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(companyValues).orderBy(asc(companyValues.sortOrder));
}

export async function createCompanyValue(value: InsertCompanyValue) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(companyValues).values(value);
}

export async function updateCompanyValue(id: number, data: Partial<InsertCompanyValue>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(companyValues).set(data).where(eq(companyValues.id, id));
  return db.select().from(companyValues).where(eq(companyValues.id, id)).limit(1);
}

export async function deleteCompanyValue(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(companyValues).where(eq(companyValues.id, id));
  return { success: true };
}

// ==================== ACHIEVEMENTS ====================
export async function getAchievements() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(achievements).orderBy(desc(achievements.year));
}

export async function createAchievement(achievement: InsertAchievement) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(achievements).values(achievement);
}

export async function updateAchievement(id: number, data: Partial<InsertAchievement>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(achievements).set(data).where(eq(achievements.id, id));
  return db.select().from(achievements).where(eq(achievements.id, id)).limit(1);
}

export async function deleteAchievement(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(achievements).where(eq(achievements.id, id));
  return { success: true };
}

// ==================== PARTNERS ====================
export async function getPartners() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(partners)
    .where(eq(partners.isActive, true))
    .orderBy(asc(partners.sortOrder));
}

export async function getAllPartners() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(partners).orderBy(asc(partners.sortOrder));
}

export async function createPartner(partner: InsertPartner) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(partners).values(partner);
}

export async function updatePartner(id: number, data: Partial<InsertPartner>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(partners).set(data).where(eq(partners.id, id));
  return db.select().from(partners).where(eq(partners.id, id)).limit(1);
}

export async function deletePartner(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(partners).where(eq(partners.id, id));
  return { success: true };
}

// ==================== CONTACT MESSAGES ====================
export async function getContactMessages(status?: string) {
  const db = await getDb();
  if (!db) return [];
  
  if (status) {
    return db.select().from(contactMessages).where(eq(contactMessages.status, status as any)).orderBy(desc(contactMessages.createdAt));
  }
  
  return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
}

export async function createContactMessage(message: InsertContactMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(contactMessages).values(message);
}

export async function updateContactMessage(id: number, data: Partial<InsertContactMessage>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(contactMessages).set(data).where(eq(contactMessages.id, id));
  return db.select().from(contactMessages).where(eq(contactMessages.id, id)).limit(1);
}

export async function deleteContactMessage(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(contactMessages).where(eq(contactMessages.id, id));
  return { success: true };
}

// ==================== CONTACT INFO ====================
export async function getContactInfo() {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(contactInfo).limit(1);
  return result[0] || null;
}

export async function upsertContactInfo(data: InsertContactInfo) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await db.select().from(contactInfo).limit(1);
  if (existing.length > 0) {
    await db.update(contactInfo).set(data).where(eq(contactInfo.id, existing[0].id));
    return existing[0];
  }
  
  return db.insert(contactInfo).values(data);
}

// ==================== SITE SETTINGS ====================
export async function getSiteSettings() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(siteSettings);
}

export async function getSiteSetting(key: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(siteSettings).where(eq(siteSettings.settingKey, key)).limit(1);
  return result[0];
}

export async function upsertSiteSetting(key: string, value: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await db.select().from(siteSettings).where(eq(siteSettings.settingKey, key)).limit(1);
  if (existing.length > 0) {
    await db.update(siteSettings).set({ settingValue: value }).where(eq(siteSettings.settingKey, key));
    return existing[0];
  }
  
  return db.insert(siteSettings).values({ settingKey: key, settingValue: value });
}
