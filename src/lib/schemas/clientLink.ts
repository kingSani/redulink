import { z } from "zod";
export const clientLinkSchema = z.object({
  url: z
    .string()
    .trim()
    .pipe(z.url({ error: "Please enter a valid URL" }))
    .refine(
      (value) => {
        try {
          const url = new URL(value);

          return (
            ["http:", "https:"].includes(url.protocol) &&
            !url.username &&
            !url.password &&
            url.hostname !== "localhost" &&
            !url.hostname.endsWith(".localhost") &&
            !url.hostname.endsWith(".local") &&
            !url.hostname.endsWith(".internal")
          );
        } catch {
          return false;
        }
      },
      { message: "Please enter a valid  URL." },
    ),
});
