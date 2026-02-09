import { type HTMLAttributes } from "react";
import { cn } from "../utils";

/**
 * Skeleton Component
 *
 * Design rationale:
 * - Perceived performance: skeleton screens reduce perceived wait time
 *   by 30-40% versus spinners (research by Bill Chung, UX Collective)
 * - Pulse animation suggests loading without demanding attention
 * - Matches the shape and size of the content it replaces
 * - Uses surface color for subtlety — not distractingly bright
 */
type SkeletonProps = HTMLAttributes<HTMLDivElement>;

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-[var(--radius-md)] bg-[var(--bg-overlay)]",
        className
      )}
      aria-hidden="true"
      {...props}
    />
  );
}

export { Skeleton, type SkeletonProps };
