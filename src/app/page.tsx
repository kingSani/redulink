import Header from "./components/Header";
import ShortenForm from "./components/ShortenForm";
import ShowAuth from "./components/ShowAuth";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans text-zinc-900 dark:bg-black dark:text-white">
      {/* Header */}
      <Header>
        <ShowAuth />
      </Header>

      {/* Main */}
      <main className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
        <svg
          aria-hidden="true"
          viewBox="0 0 500 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="pointer-events-none absolute left-0 top-1/2 z-0 w-[420px] max-w-none -translate-y-1/2 opacity-[1] sm:w-[600px] md:w-[720px]"
        >
          <defs>
            <linearGradient
              id="redulink-gradient"
              x1="80"
              y1="80"
              x2="420"
              y2="420"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#FF6A2A" />
              <stop offset="45%" stopColor="#F1243A" />
              <stop offset="100%" stopColor="#5B2DA8" />
            </linearGradient>
          </defs>

          <g transform="rotate(-35 250 250)">
            <rect
              x="75"
              y="175"
              width="230"
              height="125"
              rx="62.5"
              stroke="url(#redulink-gradient)"
              strokeWidth="34"
            />
            <rect
              x="195"
              y="175"
              width="230"
              height="125"
              rx="62.5"
              stroke="url(#redulink-gradient)"
              strokeWidth="34"
            />
          </g>
        </svg>
        <div className="w-full z-10 max-w-2xl">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Reduce links and share with ease!
              <br />
            </h1>

            <p className="mx-auto mt-5 z-10 max-w-md text-sm leading-6 text-zinc-300 sm:text-base">
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
