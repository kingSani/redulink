"use client";

import { authClient } from "@/lib/auth/client";
import LogOut from "./LogOut";
import Link from "next/link";

export default function ShowAuth() {
  const { data: session } = authClient.useSession();

  return session?.user?.id ? (
    <LogOut />
  ) : (
    <div className="flex items-center gap-2">
      <Link
        href="/auth/signin"
        className="text-sm text-zinc-500 dark:text-zinc-400"
      >
        Log In
      </Link>
      <Link
        href="/auth/signup"
        className="rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
      >
        Sign Up
      </Link>
    </div>
  );
}
