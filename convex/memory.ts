import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getSessions = query({
  args: { type: v.union(v.literal("focus"), v.literal("rubber_duck"), v.literal("accountability"), v.literal("journal")) },
  handler: async (ctx, args) => {
    const sessions = await ctx.db
      .query("sessions")
      .filter((q) => q.eq(q.field("type"), args.type))
      .order("desc")
      .take(5);
      
    return sessions.map(s => ({
      id: s._id,
      title: s.title,
      date: s.date,
      messages: s.messages,
      sentiment: s.sentiment
    }));
  },
});

export const createSession = mutation({
  args: {
    type: v.union(v.literal("focus"), v.literal("rubber_duck"), v.literal("accountability"), v.literal("journal")),
    title: v.string(),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("sessions")
      .filter((q) => q.eq(q.field("type"), args.type))
      .order("desc")
      .collect();
      
    if (existing.length >= 5) {
      // Free up a slot by deleting the oldest
      await ctx.db.delete(existing[existing.length - 1]._id);
    }

    const sessionId = await ctx.db.insert("sessions", {
      type: args.type,
      title: args.title,
      date: args.date,
      messages: [],
    });
    
    return sessionId;
  },
});

export const deleteSession = mutation({
  args: { id: v.id("sessions") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const updateMessages = mutation({
  args: {
    id: v.id("sessions"),
    messages: v.array(
      v.object({
        role: v.union(v.literal("system"), v.literal("user"), v.literal("assistant")),
        content: v.string()
      })
    ),
    sentiment: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const patchObj: any = { messages: args.messages };
    if (args.sentiment !== undefined) {
      patchObj.sentiment = args.sentiment;
    }
    await ctx.db.patch(args.id, patchObj);
  },
});
