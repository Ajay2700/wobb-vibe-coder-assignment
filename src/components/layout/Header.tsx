import { NavLink, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, Sparkles } from "lucide-react";
import { useShortlistCount } from "@/store/shortlistStore";
import { ThemeToggle } from "@/components/ThemeToggle";
import { badgePop, springSnappy } from "@/lib/motionPresets";
import { cn } from "@/utils/cn";

export function Header() {
  const count = useShortlistCount();

  return (
    <header className="sticky top-0 z-30 border-b border-[rgb(var(--border))] bg-[rgb(var(--surface))]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="group flex items-center gap-2 rounded-xl px-2 py-1 -mx-2 -my-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          aria-label="Wobb — home"
        >
          <motion.span
            whileHover={{ rotate: [0, -8, 8, 0] }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-sm"
          >
            <Sparkles className="h-4 w-4" aria-hidden />
          </motion.span>
          <span className="font-bold tracking-tight text-[rgb(var(--text))] text-lg">
            Wobb
          </span>
          <span className="hidden text-xs font-medium uppercase tracking-widest text-[rgb(var(--text-subtle))] sm:inline">
            / Discovery
          </span>
        </Link>

        <nav aria-label="Primary" className="flex items-center gap-1">
          <HeaderLink to="/">Search</HeaderLink>
          <HeaderLink to="/shortlist" badge={count}>
            <Bookmark className="h-4 w-4" aria-hidden />
            <span>Shortlist</span>
          </HeaderLink>
          <div className="ml-1 border-l border-[rgb(var(--border))] pl-1">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}

function HeaderLink({
  to,
  children,
  badge,
}: {
  to: string;
  children: React.ReactNode;
  badge?: number;
}) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        cn(
          "relative inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
          isActive
            ? "text-brand-600 dark:text-brand-300"
            : "text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))] hover:bg-[rgb(var(--surface-muted))]"
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId="header-nav-pill"
              className="absolute inset-0 rounded-lg bg-brand-500/10"
              transition={springSnappy}
              aria-hidden
            />
          )}
          <span className="relative flex items-center gap-1.5">{children}</span>
          <AnimatePresence mode="popLayout">
            {badge !== undefined && badge > 0 && (
              <motion.span
                key={badge}
                variants={badgePop}
                initial="hidden"
                animate={["visible", "pulse"]}
                exit="exit"
                className="relative inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1.5 text-[10px] font-semibold text-white"
                aria-label={`${badge} shortlisted`}
              >
                {badge > 99 ? "99+" : badge}
              </motion.span>
            )}
          </AnimatePresence>
        </>
      )}
    </NavLink>
  );
}
