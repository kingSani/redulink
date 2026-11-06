import { NextRequest, NextResponse, after } from "next/server";
import { db } from "@/db";
import { clicksTable, linksTable } from "@/db/schema";
import { eq } from "drizzle-orm";

interface RouteParams {
  params: Promise<{ code: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { code } = await params;
  // this is from next/headers, it is a Headers object that contains the headers of the request
  const userAgent = request.headers.get("user-agent") || "Unknown";
  const referrer = request.headers.get("referer") || null;

  const [linkRecord] = await db
    .select()
    .from(linksTable)
    .where(eq(linksTable.code, code));
  if (!linkRecord) {
    return new NextResponse("Link not found", { status: 404 });
  }
  const url = linkRecord.url;

  // Using after so that the click record is inserted after the response is sent to the client
  // This is important for performance, as we don't want to delay the redirect for the user
  // Also we don't want to block the redirect if the click record insertion fails, so we catch any errors and log them
  after(async () => {
    try {
      const hostname = referrer ? new URL(referrer).hostname : null;
      await db.insert(clicksTable).values({
        linkId: linkRecord.id,
        userAgent: userAgent,
        referrer: hostname,
      });
    } catch (error) {
      console.error("Error inserting click record:", error);
    }
  });

  return NextResponse.redirect(url, { status: 307 });
}
