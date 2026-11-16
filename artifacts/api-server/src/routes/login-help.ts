import { Router } from "express";
import { AskLoginHelpBody } from "@workspace/api-zod";
import { logger } from "../lib/logger";

const router = Router();
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 8;
const requestsByIp = new Map<string, { count: number; resetAt: number }>();

function isLikelySensitive(message: string): boolean {
  return (
    /\b(?:password|passcode|verification code|one[- ]time code|otp|pin)\s*(?:is|:|=)\s*\S+/i.test(
      message,
    ) ||
    /\b(?:sk-[A-Za-z0-9_-]{20,}|eyJ[A-Za-z0-9_-]{20,})\b/.test(message) ||
    /(?:\d[ -]?){13,19}/.test(message) ||
    /\b\d{6,8}\b/.test(message)
  );
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const current = requestsByIp.get(ip);
  if (!current || now >= current.resetAt) {
    requestsByIp.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    if (requestsByIp.size > 2_000) {
      for (const [key, value] of requestsByIp) {
        if (now >= value.resetAt) requestsByIp.delete(key);
      }
    }
    return false;
  }
  current.count += 1;
  return current.count > MAX_REQUESTS_PER_WINDOW;
}

router.post("/login-help", async (req, res) => {
  const parsed = AskLoginHelpBody.safeParse(req.body);
  if (!parsed.success || parsed.data.message.trim().length < 3) {
    res.status(400).json({ error: "Write a short description of the sign-in issue." });
    return;
  }

  const message = parsed.data.message.trim();
  if (isLikelySensitive(message)) {
    res.status(400).json({
      error: "Remove passwords, verification codes, card details, and account secrets before sending.",
    });
    return;
  }

  const ip = req.ip || req.socket.remoteAddress || "unknown";
  if (isRateLimited(ip)) {
    res.status(429).json({ error: "Please wait a minute before asking for more help." });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.status(503).json({ error: "Login help is not configured yet. Please use the sign-in page's Forgot password option." });
    return;
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_output_tokens: 240,
        input: [
          {
            role: "system",
            content: [{
              type: "input_text",
              text: "You are the ALL IN ONE website sign-in helper. Give concise, safe steps for problems signing in to this website only. Recommend Clerk's built-in Forgot password flow when relevant. You cannot inspect accounts, reset passwords, or change account settings. Never ask for or repeat passwords, verification codes, one-time codes, card details, or secret account information. Do not troubleshoot Netflix, HBO Max, OSN, Shahid, Hulu, or other third-party account credentials; direct users to the provider's official support. The website's purchases are demo-only. Do not claim that real streaming access or payments are available. Answer in the user's language.",
            }],
          },
          {
            role: "user",
            content: [{ type: "input_text", text: message }],
          },
        ],
      }),
    });

    if (!response.ok) {
      logger.warn({ status: response.status }, "Login help provider request failed");
      res.status(503).json({ error: "Login help is temporarily unavailable. Try again shortly." });
      return;
    }

    const payload = (await response.json()) as {
      output?: Array<{ content?: Array<{ type?: string; text?: string }> }>;
    };
    const answer = payload.output
      ?.flatMap((item) => item.content ?? [])
      .find((item) => item.type === "output_text")
      ?.text?.trim();

    if (!answer) {
      logger.warn("Login help provider returned no text");
      res.status(503).json({ error: "Login help is temporarily unavailable. Try again shortly." });
      return;
    }

    res.json({ answer: answer.slice(0, 2_500) });
  } catch (error) {
    logger.error({ err: error }, "Login help request failed");
    res.status(503).json({ error: "Login help is temporarily unavailable. Try again shortly." });
  }
});

export default router;
