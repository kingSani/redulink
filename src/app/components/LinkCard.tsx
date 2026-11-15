'use client';
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

interface LinkCardProps {
  code: string;
}
const emptySubscribe = () => () => {};

export default function LinkCard({ code }: LinkCardProps) {
  const [isCopied, setIsCopied] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);

  const origin = useSyncExternalStore(
    emptySubscribe,
    () => window.location.origin, // Client snapshot
    () => "", // Server snapshot (prevents hydration mismatch)
  );
  useEffect(() => {
    if (code && targetRef.current) {
      targetRef.current.scrollIntoView({
        // Scroll to the target element, which is the short link container
        behavior: "smooth",
        block: "center",
      });
      targetRef.current.focus({ preventScroll: true }); //this is to ensure that the element is focused without scrolling, as we already scrolled to it
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [code]);
  return (
    <div className="mt-6 rounded-xl  bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-black sm:p-6">
      <p className="mb-3 text-sm font-medium text-zinc-500">
        Your short link is ready!
      </p>

      <div
        className="flex flex-col gap-3 sm:flex-row sm:items-center"
        ref={targetRef}
        tabIndex={-1}
      >
        <a
          href={`/${code}`}
          target="_blank"
          rel="noopener noreferrer"
          className="min-w-0 flex-1 break-all text-base font-semibold text-zinc-900 transition hover:underline dark:text-white"
        >
          {origin}/{code}
        </a>

        <button
          type="button"
          disabled={isCopied}
          onClick={() => {
            navigator.clipboard.writeText(`${origin}/${code}`);
            setIsCopied(true);
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
              setIsCopied(false);
            }, 800);
          }}
          className="shrink-0 rounded-lg  px-4 py-2.5 text-sm font-medium transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          {isCopied ? "Copied!" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
