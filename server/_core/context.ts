import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk, verifyEmailSession } from "./sdk";
import { parse as parseCookieHeader } from "cookie";
import * as db from "../db";
import { COOKIE_NAME } from "@shared/const";
import { getUserById } from "../db";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    // Try email/password auth first
    const cookies = parseCookieHeader(opts.req.headers.cookie || '');
    const sessionCookie = cookies[COOKIE_NAME];
    
    if (sessionCookie) {
      const emailSession = await verifyEmailSession(sessionCookie);
      if (emailSession) {
        const dbUser = await getUserById(emailSession.userId);
        if (dbUser) {
          user = dbUser;
        }
      }
    }
    
    // Fallback to OAuth if email auth didn't work
    if (!user) {
      user = await sdk.authenticateRequest(opts.req);
    }
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
