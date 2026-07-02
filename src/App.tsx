import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useThemeEffect } from "@/store/themeStore";
import { RouteFallback } from "@/components/RouteFallback";

const SearchPage = lazy(() =>
  import("@/pages/SearchPage").then((m) => ({ default: m.SearchPage }))
);
const ProfileDetailPage = lazy(() =>
  import("@/pages/ProfileDetailPage").then((m) => ({ default: m.ProfileDetailPage }))
);
const ShortlistPage = lazy(() =>
  import("@/pages/ShortlistPage").then((m) => ({ default: m.ShortlistPage }))
);
const NotFoundPage = lazy(() =>
  import("@/pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage }))
);

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        <Suspense fallback={<RouteFallback />}>
          <Routes location={location}>
            <Route path="/" element={<SearchPage />} />
            <Route path="/profile/:username" element={<ProfileDetailPage />} />
            <Route path="/shortlist" element={<ShortlistPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  useThemeEffect();
  return (
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 2500,
            className:
              "!bg-[rgb(var(--surface-elev))] !text-[rgb(var(--text))] !border !border-[rgb(var(--border))]",
          }}
        />
      </MotionConfig>
    </ErrorBoundary>
  );
}

export default App;
