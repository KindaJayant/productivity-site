import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  sessions: defineTable({
    type: v.union(
      v.literal("focus"),
      v.literal("rubber_duck"),
      v.literal("accountability"),
      v.literal("journal")
    ),
    title: v.string(),
    status: v.optional(v.string()),
    date: v.string(), // ISO string from frontend
    messages: v.array(
      v.object({
        role: v.union(v.literal("system"), v.literal("user"), v.literal("assistant")),
        content: v.string()
      })
    ),
    // Optionally keep these from before if needed
    startTime: v.optional(v.number()), 
    endTime: v.optional(v.number()),
    goal: v.optional(v.string()),
    sentiment: v.optional(v.string()),
  }),

  user_stats: defineTable({
    userId: v.string(),
    streak: v.number(),
    lastLoggedDate: v.string(),
  }),

  logs: defineTable({
    sessionId: v.id("sessions"),
    role: v.union(v.literal("user"), v.literal("agent")),
    content: v.string(),
    timestamp: v.number(), // Unix timestamp
  }).index("by_session", ["sessionId"]),

  memory_chunks: defineTable({
    type: v.union(
      v.literal("blocker"),
      v.literal("pattern"),
      v.literal("streak"),
      v.literal("general")
    ),
    content: v.string(),
    importance: v.number(), // 1 to 10
    timestamp: v.number(), // Unix timestamp
  }),
});
