import { universitiesRouter } from "~/server/api/routers/universities";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  universities: universitiesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
