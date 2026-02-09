import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../utils";

/**
 * Separator Component
 *
 * Design rationale:
 * - Visual boundary between content sections
 * - Subtle color to separate without dominating
 * - Supports horizontal (default) and vertical orientation
 * - Uses border-color token for consistency with card borders
 */
interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}

const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role={decorative ? "none" : "separator"}
        aria-orientation={decorative ? undefined : orientation}
        className={cn(
          "shrink-0 bg-[var(--border-default)]",
          orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
          className
        )}
        {...props}
      />
    );
  }
);

Separator.displayName = "Separator";

export { Separator, type SeparatorProps };
