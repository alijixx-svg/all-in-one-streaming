const TABLE = "all_in_one_user_data";

type StoredUserData = {
  data: unknown;
  updated_at: string;
};

function getSupabaseConfig() {
  const rawUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!rawUrl || !serviceRoleKey) {
    throw new Error("Supabase account storage is not configured.");
  }

  const url = new URL(rawUrl);
  if (url.protocol !== "https:") {
    throw new Error("Supabase account storage requires an HTTPS URL.");
  }

  return { url, serviceRoleKey };
}

function requestHeaders(serviceRoleKey: string, extra?: Record<string, string>) {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

async function ensureSuccess(response: Response) {
  if (!response.ok) {
    throw new Error(`Supabase account storage returned HTTP ${response.status}.`);
  }
}

export async function getAllInOneUserData(userId: string) {
  const { url, serviceRoleKey } = getSupabaseConfig();
  const endpoint = new URL(`/rest/v1/${TABLE}`, url);
  endpoint.searchParams.set("select", "data,updated_at");
  endpoint.searchParams.set("clerk_user_id", `eq.${userId}`);
  endpoint.searchParams.set("limit", "1");

  const response = await fetch(endpoint, {
    method: "GET",
    headers: requestHeaders(serviceRoleKey),
    signal: AbortSignal.timeout(8_000),
  });
  await ensureSuccess(response);

  const records = await response.json() as StoredUserData[];
  const record = records[0];
  return record ? { data: record.data, updatedAt: record.updated_at } : null;
}

export async function saveAllInOneUserData(
  userId: string,
  data: unknown,
  updatedAt = new Date(),
) {
  const { url, serviceRoleKey } = getSupabaseConfig();
  const endpoint = new URL(`/rest/v1/${TABLE}`, url);
  endpoint.searchParams.set("on_conflict", "clerk_user_id");

  const response = await fetch(endpoint, {
    method: "POST",
    headers: requestHeaders(serviceRoleKey, {
      Prefer: "resolution=merge-duplicates,return=minimal",
    }),
    body: JSON.stringify({
      clerk_user_id: userId,
      data,
      updated_at: updatedAt.toISOString(),
    }),
    signal: AbortSignal.timeout(8_000),
  });
  await ensureSuccess(response);
}
