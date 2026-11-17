import type { Metadata } from "next";
import { Geist_Mono, Ubuntu, Satisfy } from "next/font/google";
import "./globals.css";

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"], // Available weights for Ubuntu
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-ubuntu",
});
const satisfy = Satisfy({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-satisfy",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Redulink",
  description:
    "Redulink is a free URL shortener. Paste a long link and get a short one to share in seconds. No signup required.",
};

const Footer = async () => {
  "use cache";
  return (
    <footer className="border-t border-zinc-200/70 dark:border-zinc-800/70">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 text-xs text-zinc-500 sm:flex-row sm:px-8">
        <p>© {new Date().getFullYear()} Redulink. All rights reserved.</p>

        <p>Its completely free to use.</p>
      </div>
    </footer>
  );
};
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${ubuntu.variable} ${satisfy.variable}  h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Footer />
      </body>
    </html>
  );
}
