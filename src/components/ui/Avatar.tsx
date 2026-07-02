import { useState } from "react";
import { motion } from "framer-motion";
import { springSnappy } from "@/lib/motionPresets";
import { cn } from "@/utils/cn";

interface AvatarProps {
  src?: string;
  alt: string;
  size?: number;
  className?: string;
}

/** Circular avatar with graceful fallback (initials on gradient) if the image fails. */
export function Avatar({ src, alt, size = 48, className }: AvatarProps) {
  const [errored, setErrored] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const initials = getInitials(alt);

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-brand-400 to-brand-700 text-white",
        className
      )}
      style={{ width: size, height: size }}
      aria-label={alt}
    >
      {!errored && src && (
        <motion.img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setErrored(true)}
          onLoad={() => setLoaded(true)}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={loaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={springSnappy}
          className="h-full w-full object-cover"
          width={size}
          height={size}
        />
      )}
      {(errored || !src) && (
        <motion.span
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={springSnappy}
          className="font-semibold"
          style={{ fontSize: size * 0.4 }}
        >
          {initials}
        </motion.span>
      )}
    </div>
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";
}
