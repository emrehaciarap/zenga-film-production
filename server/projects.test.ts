import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database functions
vi.mock("./db", () => ({
  getAllProjects: vi.fn(),
  getProjectsByCategory: vi.fn(),
  getFeaturedProjects: vi.fn(),
  getProjectBySlug: vi.fn(),
  getProjectById: vi.fn(),
  createProject: vi.fn(),
  updateProject: vi.fn(),
  deleteProject: vi.fn(),
}));

import * as db from "./db";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@zenga.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("projects router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("list", () => {
    it("returns all projects when no filter is provided", async () => {
      const mockProjects = [
        { id: 1, title: "Test Film", category: "film", status: "active" },
        { id: 2, title: "Test Reklam", category: "reklam", status: "draft" },
      ];
      vi.mocked(db.getAllProjects).mockResolvedValue(mockProjects as any);

      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.projects.list({});

      expect(db.getAllProjects).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(mockProjects);
    });

    it("filters projects by status", async () => {
      const mockProjects = [
        { id: 1, title: "Active Film", category: "film", status: "active" },
      ];
      vi.mocked(db.getAllProjects).mockResolvedValue(mockProjects as any);

      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.projects.list({ status: "active" });

      expect(db.getAllProjects).toHaveBeenCalledWith("active");
      expect(result).toEqual(mockProjects);
    });
  });

  describe("featured", () => {
    it("returns featured projects", async () => {
      const mockFeatured = [
        { id: 1, title: "Featured Film", isFeatured: true },
      ];
      vi.mocked(db.getFeaturedProjects).mockResolvedValue(mockFeatured as any);

      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.projects.featured();

      expect(db.getFeaturedProjects).toHaveBeenCalled();
      expect(result).toEqual(mockFeatured);
    });
  });

  describe("bySlug", () => {
    it("returns a project by slug", async () => {
      const mockProject = { id: 1, title: "Test Film", slug: "test-film" };
      vi.mocked(db.getProjectBySlug).mockResolvedValue(mockProject as any);

      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.projects.bySlug({ slug: "test-film" });

      expect(db.getProjectBySlug).toHaveBeenCalledWith("test-film");
      expect(result).toEqual(mockProject);
    });
  });

  describe("create (admin only)", () => {
    it("creates a new project when user is admin", async () => {
      const newProject = {
        title: "New Film",
        slug: "new-film",
        category: "film" as const,
      };
      const createdProject = { id: 1, ...newProject };
      vi.mocked(db.createProject).mockResolvedValue(createdProject as any);

      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.projects.create(newProject);

      expect(db.createProject).toHaveBeenCalledWith(newProject);
      expect(result).toEqual(createdProject);
    });

    it("throws FORBIDDEN when user is not admin", async () => {
      const ctx = createPublicContext();
      ctx.user = {
        id: 2,
        openId: "regular-user",
        email: "user@zenga.com",
        name: "Regular User",
        loginMethod: "manus",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      };

      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.projects.create({
          title: "New Film",
          slug: "new-film",
          category: "film",
        })
      ).rejects.toThrow("Admin access required");
    });
  });

  describe("update (admin only)", () => {
    it("updates a project when user is admin", async () => {
      const updateData = { id: 1, title: "Updated Film" };
      const updatedProject = { id: 1, title: "Updated Film", slug: "test-film" };
      vi.mocked(db.updateProject).mockResolvedValue(updatedProject as any);

      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.projects.update(updateData);

      expect(db.updateProject).toHaveBeenCalledWith(1, { title: "Updated Film" });
      expect(result).toEqual(updatedProject);
    });
  });

  describe("delete (admin only)", () => {
    it("deletes a project when user is admin", async () => {
      vi.mocked(db.deleteProject).mockResolvedValue({ success: true } as any);

      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.projects.delete({ id: 1 });

      expect(db.deleteProject).toHaveBeenCalledWith(1);
      expect(result).toEqual({ success: true });
    });
  });
});
