import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  sessions: defineTable({
    type: v.union(
      v.literal("focus"),
      v.literal("rubber_duck"),
      v.literal("accountability")
    ),
    status: v.union(
      v.literal("active"),
      v.literal("completed"),
      v.literal("abandoned")
    ),
    startTime: v.number(), // Unix timestamp
    endTime: v.optional(v.number()), // Unix timestamp
    goal: v.optional(v.string()), // Optional focus goal
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
