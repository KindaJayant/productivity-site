import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Mock user ID since there is no auth yet
const USER_ID = "default_user";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const stats = await ctx.db
      .query("user_stats")
      .filter((q) => q.eq(q.field("userId"), USER_ID))
      .first();
      
    if (!stats) return 0;

    const today = new Date().toDateString();
    if (stats.lastLoggedDate === today) {
      return stats.streak;
    }
    
    // Check if it was yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (stats.lastLoggedDate === yesterday.toDateString()) {
      return stats.streak;
    }
    
    // Streak broken
    return 0;
  },
});

export const log = mutation({
  args: {},
  handler: async (ctx) => {
    let stats = await ctx.db
      .query("user_stats")
      .filter((q) => q.eq(q.field("userId"), USER_ID))
      .first();

    const today = new Date().toDateString();

    if (!stats) {
      await ctx.db.insert("user_stats", {
        userId: USER_ID,
        streak: 1,
        lastLoggedDate: today,
      });
      return 1;
    }

    if (stats.lastLoggedDate === today) {
      return stats.streak; // Already logged today
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    let newStreak = 1;
    if (stats.lastLoggedDate === yesterday.toDateString()) {
      newStreak = stats.streak + 1;
    }

    await ctx.db.patch(stats._id, {
      streak: newStreak,
      lastLoggedDate: today,
    });

    return newStreak;
  },
});
