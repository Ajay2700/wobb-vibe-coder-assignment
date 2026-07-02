import type { ReactNode } from "react";
import { Header } from "./Header";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-svh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand-500 focus:px-3 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1 pb-16">
        {children}
      </main>
      <footer className="border-t border-[rgb(var(--border))] py-6 text-center text-xs text-[rgb(var(--text-subtle))]">
        Built for the Wobb Vibe Coder assignment · React · TypeScript · Zustand · Tailwind CSS
      </footer>
    </div>
  );
}
