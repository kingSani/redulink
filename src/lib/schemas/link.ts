import { z } from "zod";
export const baseLinkSchema = z
  .string()
  .trim()
  .transform((val) => (val.match(/^https?:\/\//i) ? val : `https://${val}`))
  .pipe(z.string().url("Please enter a valid URL"));
