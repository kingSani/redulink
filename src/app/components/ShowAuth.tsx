"use client";

import { authClient } from "@/lib/auth/client";
import LogOut from "./LogOut";
import Link from "next/link";

export default function ShowAuth() {
  const { data: session, isPending } = authClient.useSession();
  if (isPending) {
    return (
      <div className="flex items-center gap-2">
        <div
          aria-hidden="true"
          className="h-5 w-[39.28px] rounded-sm bg-gray-200 dark:bg-gray-800 animate-pulse"
        />
        <div
          aria-hidden="true"
          className="h-10 w-[83.16px] rounded-md bg-gray-200 dark:bg-gray-800 animate-pulse"
        />
      </div>
    );
  }

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
