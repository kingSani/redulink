import Image from "next/image";
import Link from "next/link";

export default function Header({ children }: { children?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-50 w-full  bg-zinc-50/80 backdrop-blur-xl dark:border-zinc-800/70 dark:bg-black/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          {/*  logo */}
          <Image
            src="/icon.svg"
            alt="Redulink Logo"
            width={10}
            height={10}
            className="h-10 w-10"
          />

          <span className="text-xl font-bold tracking-tight">edulink</span>
        </Link>
        {children}
      </div>
    </header>
  );
}
