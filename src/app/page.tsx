"use client";
import Form from "next/form";
import { type FormState, shortenLink } from "./actions";
import { useActionState } from "react";
export default function Home() {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    shortenLink,
    null,
  );
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Form action={formAction}>
          <div className="flex flex-col items-center justify-center gap-4">
            <input type="url" name="url" placeholder="https://example.com" />
            <button type="submit" disabled={isPending}>
              {isPending ? "Shortening..." : "Shorten Link"}
            </button>
          </div>
        </Form>
        {state?.errors && (
          <p className="mt-4 text-red-500 text-sm font-medium">Bad link</p>
        )}

        {state?.success && "code" in state && (
          <div className="mt-6 p-4 bg-zinc-100 dark:bg-zinc-900 rounded-lg text-center w-full max-w-md border border-zinc-200 dark:border-zinc-800">
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
              Your short link is ready:
            </p>
            <p className="text-blue-600 font-bold mt-1 text-lg">
              {typeof window !== "undefined" ? window.location.origin : ""}/
              {state.code as string}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
