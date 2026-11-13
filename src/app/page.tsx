"use client";

import Form from "next/form";
import { type FormState, shortenLink } from "./actions";
import { useActionState, useEffect, useState } from "react";
import Image from "next/image";
import { clientLinkSchema } from "@/lib/schemas/clientLink";

export default function Home() {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    shortenLink,
    null,
  );
  const [clientErrors, setClientErrors] = useState<string[]>([]);
  const [shakeInput, setShakeInput] = useState(false);
  const [hasEdited, setHasEdited] = useState(false);

  const errors = clientErrors.length
    ? clientErrors
    : state?.success === false && !hasEdited
      ? state.errors.slice(0, 1)
      : [];

  const hasErrors = errors.length > 0;

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans text-zinc-900 dark:bg-black dark:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full  bg-zinc-50/80 backdrop-blur-xl dark:border-zinc-800/70 dark:bg-black/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="#" className="flex items-center gap-2.5">
            {/*  logo */}
            <Image
              src="/icon.svg"
              alt="Redulink Logo"
              width={10}
              height={10}
              className="h-10 w-10"
            />

            <span className="text-xl font-bold tracking-tight">edulink</span>
          </a>
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-2xl">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Shorten links and share with ease!
              <br />
            </h1>

            <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-zinc-500 sm:text-base">
              Redulink is a simple and free URL shortener. Just paste your long
              URL, and we&apos;ll reduce it for you to share.
            </p>
          </div>

          <div className="rounded-2xl   bg-white p-5 shadow-[0_8px_40px_rgba(0,0,0,0.05)] dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-[0_8px_40px_rgba(0,0,0,0.25)] sm:p-8">
            <Form
              action={(formData) => {
                const result = clientLinkSchema.safeParse({
                  url: formData.get("url"),
                });
                if (!result.success) {
                  setClientErrors([result.error.issues[0].message]);
                  setShakeInput(false);
                  requestAnimationFrame(() => setShakeInput(true));
                  return;
                }

                setHasEdited(false);
                setClientErrors([]);
                setShakeInput(false);
                formAction(formData);
              }}
            >
              <div className="flex flex-col gap-4">
                <label
                  htmlFor="url"
                  className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Enter your destination URL
                </label>

                <input
                  id="url"
                  type="text"
                  name="url"
                  placeholder="https://example.com/your-long-url"
                  required
                  disabled={isPending}
                  aria-invalid={hasErrors}
                  aria-describedby={hasErrors ? "url-errors" : undefined}
                  onChange={() => {
                    setClientErrors([]);
                    setHasEdited(true);
                  }}
                  className={`w-full rounded-xl border px-4 py-4 text-base outline-none transition-all duration-300
    placeholder:text-gray-500 disabled:opacity-60
    ${
      hasErrors
        ? "border-red-500/70 bg-red-500/5 text-zinc-900 ring-2 ring-red-500/10 focus:border-red-500 dark:text-white"
        : "border-transparent bg-black/5 text-zinc-900 focus:border-zinc-300 focus:bg-white focus:ring-2 focus:ring-black/10 dark:bg-white/5 dark:text-white dark:focus:border-zinc-700 dark:focus:bg-zinc-900 dark:focus:ring-white/20"
    }
    ${shakeInput ? "animate-[shake_0.35s_ease-in-out]" : ""}
  `}
                />

                <button
                  type="submit"
                  disabled={isPending}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-zinc-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                >
                  {isPending ? (
                    <>
                      <span className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current" />
                      </span>
                      Shortening
                    </>
                  ) : (
                    "Shorten Link"
                  )}
                </button>
              </div>
            </Form>

            {/* Errors */}
            <div
              className={`grid transition-[grid-template-rows,opacity,transform] duration-300 ease-in-out ${
                hasErrors
                  ? "grid-rows-[1fr] translate-y-0 opacity-100"
                  : "grid-rows-[0fr] -translate-y-2 opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                {hasErrors && (
                  <div
                    id="url-errors"
                    role="alert"
                    className="mt-4 rounded-xl bg-red-500/10 p-4 text-sm leading-relaxed text-red-500"
                  >
                    {errors.map((error, index) => (
                      <p key={index}>{error}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Success */}
            {state?.success && "code" in state && (
              <div className="mt-6 rounded-xl  bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-black sm:p-6">
                <p className="mb-3 text-sm font-medium text-zinc-500">
                  Your short link is ready!
                </p>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <a
                    href={`/${state.code}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-w-0 flex-1 break-all text-base font-semibold text-zinc-900 transition hover:underline dark:text-white"
                  >
                    {typeof window !== "undefined"
                      ? window.location.origin
                      : ""}
                    /{state.code}
                  </a>

                  <button
                    type="button"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `${window.location.origin}/${state.code}`,
                      )
                    }
                    className="shrink-0 rounded-lg  px-4 py-2.5 text-sm font-medium transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                  >
                    Copy link
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
