"use client";

import { useActionState, useEffect, useState } from "react";

import { authClient } from "@/lib/auth/client";

import LogOut from "./components/LogOut";
import Link from "next/link";

import Header from "./components/Header";
import ShortenForm from "./components/ShortenForm";

export default function Home() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    authClient.getSession().then(({ data }) => {
      if (data?.session) {
        setUserId(data.session.userId);
      }
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans text-zinc-900 dark:bg-black dark:text-white">
      {/* Header */}
      <Header>
        {userId ? (
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
        )}
      </Header>

      {/* Main */}
      <main className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-2xl">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Reduce links and share with ease!
              <br />
            </h1>

            <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-zinc-500 sm:text-base">
              Redulink is a simple and free URL shortener. Just paste your long
              URL, and we&apos;ll reduce it for you to share.{" "}
            </p>
          </div>

          <div className="rounded-2xl   bg-white p-5 shadow-[0_8px_40px_rgba(0,0,0,0.05)] dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-[0_8px_40px_rgba(0,0,0,0.25)] sm:p-8">
            <ShortenForm />
          </div>
        </div>
      </main>
    </div>
  );
}
