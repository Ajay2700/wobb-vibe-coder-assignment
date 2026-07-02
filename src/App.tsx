import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MotionConfig } from "framer-motion";
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

function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/profile/:username" element={<ProfileDetailPage />} />
        <Route path="/shortlist" element={<ShortlistPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  useThemeEffect();
  return (
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <AppRoutes />
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
