import { memo, type MouseEvent } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import toast from "react-hot-toast";
import type { Platform, UserProfileSummary } from "@/types";
import { useShortlistStore } from "@/store/shortlistStore";
import { cn } from "@/utils/cn";

interface AddToListButtonProps {
  profile: UserProfileSummary;
  platform: Platform;
  variant?: "compact" | "full";
  className?: string;
}

function AddToListButtonImpl({
  profile,
  platform,
  variant = "compact",
  className,
}: AddToListButtonProps) {
  const added = useShortlistStore((s) => s.items.some((it) => it.user_id === profile.user_id));
  const toggle = useShortlistStore((s) => s.toggle);

  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    const result = toggle(profile, platform);
    if (result.added) {
      toast.success(`Added @${profile.username} to shortlist`, { id: `add-${profile.user_id}` });
    } else {
      toast(`Removed @${profile.username}`, { id: `rm-${profile.user_id}`, icon: "🗑️" });
    }
  };

  const Icon = added ? BookmarkCheck : Bookmark;
  const label = added ? "Remove from shortlist" : "Add to shortlist";

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        aria-pressed={added}
        title={label}
        className={cn(
          "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
          added
            ? "bg-brand-500 text-white shadow-sm hover:brightness-110"
            : "bg-[rgb(var(--surface-muted))] text-[rgb(var(--text-muted))] hover:bg-brand-500/10 hover:text-brand-600 dark:hover:text-brand-300",
          className
        )}
      >
        <Icon className={cn("h-4 w-4", added && "animate-pop")} aria-hidden />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={added}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 font-medium transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
        added
          ? "border border-brand-500/30 bg-brand-500/10 text-brand-600 dark:text-brand-300 hover:bg-brand-500/15"
          : "bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-sm hover:shadow-md hover:brightness-110",
        className
      )}
    >
      <Icon className={cn("h-4 w-4", added && "animate-pop")} aria-hidden />
      {added ? "In shortlist" : "Add to shortlist"}
    </button>
  );
}

export const AddToListButton = memo(AddToListButtonImpl);
