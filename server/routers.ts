import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import * as db from "./db";
import { createEmailSessionToken } from "./_core/sdk";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Admin procedure - requires admin role
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

// ==================== PROJECTS ROUTER ====================
const projectsRouter = router({
  list: publicProcedure
    .input(z.object({ status: z.enum(['active', 'coming_soon', 'draft']).optional() }).optional())
    .query(async ({ input }) => {
      return db.getAllProjects(input?.status);
    }),
  
  byCategory: publicProcedure
    .input(z.object({ category: z.enum(['film', 'reklam', 'belgesel', 'muzik_video']) }))
    .query(async ({ input }) => {
      return db.getProjectsByCategory(input.category);
    }),
  
  featured: publicProcedure.query(async () => {
    return db.getFeaturedProjects();
  }),
  
  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      return db.getProjectBySlug(input.slug);
    }),
  
  byId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return db.getProjectById(input.id);
    }),
  
  create: adminProcedure
    .input(z.object({
      title: z.string(),
      slug: z.string(),
      category: z.enum(['film', 'reklam', 'belgesel', 'muzik_video']),
      shortDescription: z.string().optional(),
      fullDescription: z.string().optional(),
      thumbnail: z.string().optional(),
      gallery: z.array(z.string()).optional(),
      videoUrl: z.string().optional(),
      director: z.string().optional(),
      camera: z.string().optional(),
      duration: z.string().optional(),
      year: z.number().optional(),
      crew: z.string().optional(),
      status: z.enum(['active', 'coming_soon', 'draft']).optional(),
      sortOrder: z.number().optional(),
      isFeatured: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      return db.createProject(input);
    }),
  
  update: adminProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      slug: z.string().optional(),
      category: z.enum(['film', 'reklam', 'belgesel', 'muzik_video']).optional(),
      shortDescription: z.string().optional(),
      fullDescription: z.string().optional(),
      thumbnail: z.string().optional(),
      gallery: z.array(z.string()).optional(),
      videoUrl: z.string().optional(),
      director: z.string().optional(),
      camera: z.string().optional(),
      duration: z.string().optional(),
      year: z.number().optional(),
      crew: z.string().optional(),
      status: z.enum(['active', 'coming_soon', 'draft']).optional(),
      sortOrder: z.number().optional(),
      isFeatured: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return db.updateProject(id, data);
    }),
  
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return db.deleteProject(input.id);
    }),
});

// ==================== COMING SOON ROUTER ====================
const comingSoonRouter = router({
  list: publicProcedure.query(async () => {
    return db.getComingSoonProjects();
  }),
  
  listAll: adminProcedure.query(async () => {
    return db.getAllComingSoonProjects();
  }),
  
  create: adminProcedure
    .input(z.object({
      title: z.string(),
      teaserImage: z.string().optional(),
      teaserVideo: z.string().optional(),
      description: z.string().optional(),
      releaseDate: z.date().optional(),
      isActive: z.boolean().optional(),
      sortOrder: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      return db.createComingSoonProject(input);
    }),
  
  update: adminProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      teaserImage: z.string().optional(),
      teaserVideo: z.string().optional(),
      description: z.string().optional(),
      releaseDate: z.date().optional(),
      isActive: z.boolean().optional(),
      sortOrder: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return db.updateComingSoonProject(id, data);
    }),
  
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return db.deleteComingSoonProject(input.id);
    }),
  
  subscribe: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      return db.subscribeEmail(input.email);
    }),
  
  subscribers: adminProcedure.query(async () => {
    return db.getAllSubscribers();
  }),
});

// ==================== TEAM ROUTER ====================
const teamRouter = router({
  list: publicProcedure
    .input(z.object({ department: z.enum(['yonetim', 'kreatif', 'produksiyon', 'teknik']).optional() }).optional())
    .query(async ({ input }) => {
      return db.getTeamMembers(input?.department);
    }),
  
  listAll: adminProcedure.query(async () => {
    return db.getAllTeamMembers();
  }),
  
  create: adminProcedure
    .input(z.object({
      name: z.string(),
      position: z.string(),
      department: z.enum(['yonetim', 'kreatif', 'produksiyon', 'teknik']),
      photo: z.string().optional(),
      shortBio: z.string().optional(),
      fullBio: z.string().optional(),
      linkedinUrl: z.string().optional(),
      imdbUrl: z.string().optional(),
      sortOrder: z.number().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      return db.createTeamMember(input);
    }),
  
  update: adminProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      position: z.string().optional(),
      department: z.enum(['yonetim', 'kreatif', 'produksiyon', 'teknik']).optional(),
      photo: z.string().optional(),
      shortBio: z.string().optional(),
      fullBio: z.string().optional(),
      linkedinUrl: z.string().optional(),
      imdbUrl: z.string().optional(),
      sortOrder: z.number().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return db.updateTeamMember(id, data);
    }),
  
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return db.deleteTeamMember(input.id);
    }),
});

// ==================== ORG CHART ROUTER ====================
const orgRouter = router({
  list: publicProcedure.query(async () => {
    return db.getOrgPositions();
  }),
  
  create: adminProcedure
    .input(z.object({
      title: z.string(),
      name: z.string().optional(),
      department: z.string().optional(),
      parentId: z.number().optional(),
      photo: z.string().optional(),
      bio: z.string().optional(),
      sortOrder: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      return db.createOrgPosition(input);
    }),
  
  update: adminProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      name: z.string().optional(),
      department: z.string().optional(),
      parentId: z.number().optional(),
      photo: z.string().optional(),
      bio: z.string().optional(),
      sortOrder: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return db.updateOrgPosition(id, data);
    }),
  
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return db.deleteOrgPosition(input.id);
    }),
});

// ==================== ABOUT ROUTER ====================
const aboutRouter = router({
  content: publicProcedure.query(async () => {
    return db.getAboutContent();
  }),
  
  updateContent: adminProcedure
    .input(z.object({
      section: z.enum(['vision', 'mission', 'story', 'values']),
      title: z.string().optional(),
      content: z.string().optional(),
      image: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return db.upsertAboutContent(input);
    }),
  
  values: publicProcedure.query(async () => {
    return db.getCompanyValues();
  }),
  
  createValue: adminProcedure
    .input(z.object({
      title: z.string(),
      description: z.string().optional(),
      icon: z.string().optional(),
      sortOrder: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      return db.createCompanyValue(input);
    }),
  
  updateValue: adminProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      description: z.string().optional(),
      icon: z.string().optional(),
      sortOrder: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return db.updateCompanyValue(id, data);
    }),
  
  deleteValue: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return db.deleteCompanyValue(input.id);
    }),
  
  achievements: publicProcedure.query(async () => {
    return db.getAchievements();
  }),
  
  createAchievement: adminProcedure
    .input(z.object({
      title: z.string(),
      description: z.string().optional(),
      year: z.number(),
      type: z.enum(['award', 'milestone']).optional(),
      sortOrder: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      return db.createAchievement(input);
    }),
  
  updateAchievement: adminProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      description: z.string().optional(),
      year: z.number().optional(),
      type: z.enum(['award', 'milestone']).optional(),
      sortOrder: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return db.updateAchievement(id, data);
    }),
  
  deleteAchievement: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return db.deleteAchievement(input.id);
    }),
  
  partners: publicProcedure.query(async () => {
    return db.getPartners();
  }),
  
  partnersAll: adminProcedure.query(async () => {
    return db.getAllPartners();
  }),
  
  createPartner: adminProcedure
    .input(z.object({
      name: z.string(),
      logo: z.string().optional(),
      website: z.string().optional(),
      sortOrder: z.number().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      return db.createPartner(input);
    }),
  
  updatePartner: adminProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      logo: z.string().optional(),
      website: z.string().optional(),
      sortOrder: z.number().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return db.updatePartner(id, data);
    }),
  
  deletePartner: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return db.deletePartner(input.id);
    }),
});

// ==================== CONTACT ROUTER ====================
const contactRouter = router({
  info: publicProcedure.query(async () => {
    return db.getContactInfo();
  }),
  
  updateInfo: adminProcedure
    .input(z.object({
      address: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().optional(),
      mapLat: z.string().optional(),
      mapLng: z.string().optional(),
      facebook: z.string().optional(),
      instagram: z.string().optional(),
      twitter: z.string().optional(),
      youtube: z.string().optional(),
      linkedin: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return db.upsertContactInfo(input);
    }),
  
  messages: adminProcedure
    .input(z.object({ status: z.enum(['unread', 'read', 'replied', 'archived']).optional() }).optional())
    .query(async ({ input }) => {
      return db.getContactMessages(input?.status);
    }),
  
  sendMessage: publicProcedure
    .input(z.object({
      name: z.string(),
      email: z.string().email(),
      phone: z.string().optional(),
      projectType: z.enum(['film', 'reklam', 'belgesel', 'muzik_video', 'diger']).optional(),
      message: z.string(),
    }))
    .mutation(async ({ input }) => {
      return db.createContactMessage(input);
    }),
  
  updateMessageStatus: adminProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(['unread', 'read', 'replied', 'archived']),
    }))
    .mutation(async ({ input }) => {
      return db.updateContactMessage(input.id, { status: input.status });
    }),
  
  deleteMessage: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return db.deleteContactMessage(input.id);
    }),
});

// ==================== SETTINGS ROUTER ====================
const settingsRouter = router({
  list: publicProcedure.query(async () => {
    return db.getSiteSettings();
  }),
  
  get: publicProcedure
    .input(z.object({ key: z.string() }))
    .query(async ({ input }) => {
      return db.getSiteSetting(input.key);
    }),
  
  set: adminProcedure
    .input(z.object({
      key: z.string(),
      value: z.string(),
    }))
    .mutation(async ({ input }) => {
      return db.upsertSiteSetting(input.key, input.value);
    }),
});

// ==================== MAIN ROUTER ====================
export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
    login: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string().min(1),
      }))
      .mutation(async ({ input, ctx }) => {
        try {
          const user = await db.verifyUserPassword(input.email, input.password);
          if (!user) {
            throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid email or password' });
          }
          const sessionToken = await createEmailSessionToken(
            user.id!,
            user.email!,
            user.name || 'User'
          );
          const cookieOptions = getSessionCookieOptions(ctx.req);
          ctx.res.cookie(COOKIE_NAME, sessionToken, {
            ...cookieOptions,
            maxAge: ONE_YEAR_MS,
          });
          return {
            success: true,
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            },
          };
        } catch (error) {
          if (error instanceof TRPCError) throw error;
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: String(error) });
        }
      }),
    register: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        try {
          const user = await db.createUserWithPassword(input.email, input.password, input.name);
          if (!user.id) {
            throw new Error('Failed to create user');
          }
          const sessionToken = await createEmailSessionToken(
            user.id,
            user.email!,
            user.name || 'User'
          );
          const cookieOptions = getSessionCookieOptions(ctx.req);
          ctx.res.cookie(COOKIE_NAME, sessionToken, {
            ...cookieOptions,
            maxAge: ONE_YEAR_MS,
          });
          return {
            success: true,
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            },
          };
        } catch (error) {
          if (error instanceof TRPCError) throw error;
          throw new TRPCError({ code: 'BAD_REQUEST', message: String(error) });
        }
      }),
  }),
  projects: projectsRouter,
  comingSoon: comingSoonRouter,
  team: teamRouter,
  org: orgRouter,
  about: aboutRouter,
  contact: contactRouter,
  settings: settingsRouter,
});

export type AppRouter = typeof appRouter;
