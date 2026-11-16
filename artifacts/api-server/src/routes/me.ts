import { Router } from "express";
import { getAuth } from "@clerk/express";
import { eq } from "drizzle-orm";
import { db, userAppDataTable } from "@workspace/db";
import { SaveMyDataBody } from "@workspace/api-zod";
import { logger } from "../lib/logger";
import { getAllInOneUserData, saveAllInOneUserData } from "../lib/supabase-user-data";

const router = Router();

router.get("/me/data", async (req, res) => {
  const userId = getAuth(req).userId;
  if (!userId) {
    res.status(401).json({ error: "Sign in to access saved account data." });
    return;
  }

  try {
    const supabaseRecord = await getAllInOneUserData(userId);
    if (supabaseRecord) {
      const validated = SaveMyDataBody.safeParse({ data: supabaseRecord.data });
      if (!validated.success) {
        throw new Error("Saved Supabase account data is invalid.");
      }
      res.json({
        data: validated.data.data,
        updatedAt: supabaseRecord.updatedAt,
      });
      return;
    }

    // Read legacy rows without deleting them. The client will save loaded data to Supabase.
    const [record] = await db
      .select({
        data: userAppDataTable.data,
        updatedAt: userAppDataTable.updatedAt,
      })
      .from(userAppDataTable)
      .where(eq(userAppDataTable.userId, userId))
      .limit(1);

    res.json({
      data: record?.data ?? null,
      ...(record ? { updatedAt: record.updatedAt.toISOString() } : {}),
    });
  } catch (error) {
    logger.error({ err: error }, "Failed to load account data");
    res.status(500).json({ error: "Could not load account data." });
  }
});

router.put("/me/data", async (req, res) => {
  const userId = getAuth(req).userId;
  if (!userId) {
    res.status(401).json({ error: "Sign in to save account data." });
    return;
  }

  const parsed = SaveMyDataBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "The submitted account data is invalid." });
    return;
  }

  try {
    const now = new Date();
    await saveAllInOneUserData(userId, parsed.data.data, now);

    res.json({ data: parsed.data.data, updatedAt: now.toISOString() });
  } catch (error) {
    logger.error({ err: error }, "Failed to save account data");
    res.status(500).json({ error: "Could not save account data." });
  }
});

export default router;
