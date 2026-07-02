import { Component, type ErrorInfo, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { fadeUp, fadeUpStagger, springSoft } from "@/lib/motionPresets";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

function ErrorFallback({ error, onReset }: { error: Error; onReset: () => void }) {
  return (
    <motion.div
      className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-4 text-center"
      variants={fadeUpStagger}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.5, rotate: -12 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={springSoft}
        className="text-6xl"
      >
        <motion.span
          animate={{ rotate: [0, -8, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="inline-block"
        >
          💥
        </motion.span>
      </motion.div>
      <motion.h1 variants={fadeUp} className="text-2xl font-semibold text-[rgb(var(--text))]">
        Something went wrong.
      </motion.h1>
      <motion.p variants={fadeUp} className="text-sm text-[rgb(var(--text-muted))]">
        {error.message}
      </motion.p>
      <motion.div variants={fadeUp}>
        <Button onClick={onReset}>Try again</Button>
      </motion.div>
    </motion.div>
  );
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("Uncaught error:", error, info);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      return <ErrorFallback error={this.state.error} onReset={this.reset} />;
    }
    return this.props.children;
  }
}
