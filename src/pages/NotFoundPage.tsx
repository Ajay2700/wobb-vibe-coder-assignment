import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { fadeUp, fadeUpStagger, springSoft } from "@/lib/motionPresets";

export function NotFoundPage() {
  return (
    <Layout>
      <motion.div
        className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-4 text-center"
        variants={fadeUpStagger}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ ...springSoft, delay: 0.05 }}
          className="bg-gradient-to-br from-brand-500 to-brand-700 bg-clip-text font-bold text-transparent"
          style={{ fontSize: "min(20vw, 8rem)", lineHeight: 1 }}
        >
          <motion.span
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block"
          >
            4
          </motion.span>
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block"
          >
            0
          </motion.span>
          <motion.span
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            className="inline-block"
          >
            4
          </motion.span>
        </motion.div>
        <motion.h1
          variants={fadeUp}
          className="text-2xl font-semibold text-[rgb(var(--text))]"
        >
          Page not found
        </motion.h1>
        <motion.p variants={fadeUp} className="text-sm text-[rgb(var(--text-muted))]">
          The page you're looking for doesn't exist or has moved.
        </motion.p>
        <motion.div variants={fadeUp}>
          <Link
            to="/"
            className="inline-flex h-10 items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 px-5 text-sm font-medium text-white shadow-sm hover:brightness-110"
          >
            Back to search
          </Link>
        </motion.div>
      </motion.div>
    </Layout>
  );
}
