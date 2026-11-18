import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function checkRateLimit(
  rateKey: string,
  maxRequests: number,
  windowSeconds: number,
) {
  await db.execute(
    sql`SELECT check_rate_limit(${rateKey}, ${maxRequests}, ${windowSeconds})`,
  );
}
