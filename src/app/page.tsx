import Header from "./components/Header";
import ShortenForm from "./components/ShortenForm";
import ShowAuth from "./components/showAuth";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans text-zinc-900 dark:bg-black dark:text-white">
      {/* Header */}
      <Header>
        <ShowAuth />
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
