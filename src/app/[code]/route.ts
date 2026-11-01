import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { linksTable } from "@/db/schema";
import { eq } from "drizzle-orm";

interface RouteParams {
  params: Promise<{ code: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { code } = await params;
  const [linkRecord] = await db
    .select()
    .from(linksTable)
    .where(eq(linksTable.code, code));
  if (!linkRecord) {
    return new NextResponse("Link not found", { status: 404 });
  }
  const url = linkRecord.url;
  return NextResponse.redirect(url);
}
