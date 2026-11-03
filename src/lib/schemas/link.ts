import { z } from "zod";

export const baseLinkSchema = z
  .string()
  .trim()
  .transform((val) => (val.match(/^https?:\/\//i) ? val : `https://${val}`))
  .pipe(z.string().url("Please enter a valid URL"))
  .refine(
    (val) => {
      const hostname = new URL(val).hostname;

      return (
        hostname !== "localhost" &&
        hostname !== "127.0.0.1" &&
        hostname !== "0.0.0.0"
      );
    },
    {
      message: "This URL is not allowed.",
    },
  );
