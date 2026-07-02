import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";

export function NotFoundPage() {
  return (
    <Layout>
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-4 text-center">
        <div
          className="bg-gradient-to-br from-brand-500 to-brand-700 bg-clip-text font-bold text-transparent"
          style={{ fontSize: "min(20vw, 8rem)", lineHeight: 1 }}
        >
          404
        </div>
        <h1 className="text-2xl font-semibold text-[rgb(var(--text))]">Page not found</h1>
        <p className="text-sm text-[rgb(var(--text-muted))]">
          The page you're looking for doesn't exist or has moved.
        </p>
        <Link
          to="/"
          className="inline-flex h-10 items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 px-5 text-sm font-medium text-white shadow-sm hover:brightness-110"
        >
          Back to search
        </Link>
      </div>
    </Layout>
  );
}
