import { z } from "zod";
import { lookup } from "node:dns/promises";
import ipaddr from "ipaddr.js";

async function isPublicDestination(url: string): Promise<boolean> {
  try {
    const parsed = new URL(url);

    if (!["http:", "https:"].includes(parsed.protocol)) {
      return false;
    }

    if (parsed.username || parsed.password) {
      return false;
    }

    let hostname = parsed.hostname.toLowerCase();

    // Remove IPv6 brackets
    hostname = hostname.replace(/^\[|\]$/g, "");

    // Block local hostnames
    if (
      hostname === "localhost" ||
      hostname.endsWith(".localhost") ||
      hostname.endsWith(".local") ||
      hostname.endsWith(".internal")
    ) {
      return false;
    }

    // Direct IP address
    if (ipaddr.isValid(hostname)) {
      return ipaddr.parse(hostname).range() === "unicast";
    }

    // DNS lookup
    const addresses = await lookup(hostname, {
      all: true,
      verbatim: true,
    });

    if (!addresses.length) return false;

    return addresses.every(({ address }) => {
      return (
        ipaddr.isValid(address) && ipaddr.parse(address).range() === "unicast"
      );
    });
  } catch {
    return false;
  }
}

export const baseLinkSchema = z.object({
  url: z
    .string()
    .trim()
    .pipe(z.url({ error: "Please enter a valid URL" }))

    .refine(isPublicDestination, {
      message: "This destination is not allowed.",
    }),
});

export type LinkInput = z.infer<typeof baseLinkSchema>;
