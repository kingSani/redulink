"use client";

import { authClient } from "@/lib/auth/client";
import { useActionState, useState, useEffect } from "react";
import { type FormState, shortenLink } from "../actions";
import Form from "next/form";
import { clientLinkSchema } from "@/lib/schemas/clientLink";
import LinkCard from "./LinkCard";
import ErrorCard from "./ErrorCard";

export default function ShortenForm() {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    shortenLink,
    null,
  );

  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [clientErrors, setClientErrors] = useState<string[]>([]);
  const [shakeInput, setShakeInput] = useState(false);
  const [hasEdited, setHasEdited] = useState(false);
  const errors = clientErrors.length
    ? clientErrors
    : state?.success === false && !hasEdited
      ? state.errors.slice(0, 1)
      : [];

  const hasErrors = errors.length > 0;
  useEffect(() => {
    authClient.getSession().then(({ data }) => {
      if (data?.session) {
        setUserId(data.session.userId);
      }
      setLoading(false);
    });
  }, []);
  return (
    <>
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
      {/* Error Card */}
      <ErrorCard errors={errors} />
      {/* Success */}
      {state?.success && "code" in state && <LinkCard code={state.code} />}
    </>
  );
}
