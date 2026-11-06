"use server";
import { baseLinkSchema } from "@/lib/schemas/link";

import { nanoid } from "nanoid";
import { db } from "@/db";

import { linksTable } from "@/db/schema";
import { DrizzleError } from "drizzle-orm";

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
  let attempts: number = 0; // prevention for infinite loop in case of collision, we will try to generate a unique code 5 times before giving up
  while (true) {
    const code = nanoid(8); // generate a unique code for the link . today is 1st of november 2026
    try {
      await db.insert(linksTable).values({
        url: validatedLink.url,
        code: code,
      }); // save the link to the database
      return { success: true, message: "Link saved!", code };
    } catch (error) {
      if (
        error instanceof DrizzleError && // drizzle wraps the error with error.cause, error.cause.code will throw an error if the error is not a drizzle error, so we need to check if the error is a drizzle error first
        error.cause && // check if the error has a cause, because drizzle wraps the error with error.cause,
        typeof error.cause == "object" &&
        "code" in error.cause &&
        String(error.cause.code) === "23505" // check if the error is a unique constraint violation, which means the code is not unique
      ) {
        console.warn("Collision hit. Retrying with a new NanoID...");
        attempts++;
        if (attempts >= 5) {
          console.error(
            "Max attempts reached. Failed to generate unique code.",
          );
          return {
            success: false,
            message: "Failed to generate unique code.",
            errors: [
              "Something went wrong while saving your link. Please try again.",
            ],
          };
        }
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
}
