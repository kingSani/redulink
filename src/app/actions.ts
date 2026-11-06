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
  const link = await baseLinkSchema.safeParseAsync(formData.get("url")); // validate the link using the baseLinkSchema
  if (!link.success)
    return {
      errors: link.error.issues.map((issue) => issue.message),
      success: false,
      message: "Invalid link.",
    }; // if the link is invalid, return the errors
  const validatedLink = link.data; // if the link is valid, get the validated link
  const code = nanoid(8); // generate a unique code for the link . today is 1st of november 2026
  while (true)
    try {
      await db.insert(linksTable).values({
        url: validatedLink.url,
        code: code,
      }); // save the link to the database
      return { success: true, message: "Link saved!", code };
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        String(error.code) === "23505"
      ) {
        console.warn("Collision hit. Retrying with a new NanoID...");
        continue; // if the code is not unique, generate a new code and try again
      }
      console.error("Drizzle error:", error);
      return {
        success: false,
        message: "Failed to save link.",
        errors: [
          "Something went wrong while saving your link. Please try again.",
        ],
      };
    }
}
