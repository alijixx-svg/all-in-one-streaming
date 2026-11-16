import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const userAppDataTable = pgTable("user_app_data", {
  userId: text("user_id").primaryKey(),
  data: jsonb("data").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type UserAppDataRecord = typeof userAppDataTable.$inferSelect;
