"use server";
import { baseLinkSchema } from "@/lib/schemas/link";

import { nanoid } from "nanoid";
import { db } from "@/db";

import { linksTable } from "@/db/schema";

export type FormState =
  | { success: true; message: string; code: string; errors?: never }
  | { success: false; message: string; errors: string[]; code?: never }
  | null;

export async function shortenLink(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const link = baseLinkSchema.safeParse(formData.get("url")); // validate the link using the baseLinkSchema
  if (!link.success)
    return {
      errors: link.error.issues.map((issue) => issue.message),
      success: false,
      message: "Invalid link.",
    }; // if the link is invalid, return the errors
  const validatedLink = link.data; // if the link is valid, get the validated link
  const code = nanoid(6); // generate a unique code for the link . today is 1st of november 2026
  try {
    await db.insert(linksTable).values({
      url: validatedLink,
      code,
    }); // save the link to the database
    return { success: true, message: "Link saved!", code };
  } catch (error) {
    console.error("Drizzle error:", error);
    return {
      success: false,
      message: "Failed to save link.",
      errors: ["Database insertion failure occurred."],
    };
  }
}
