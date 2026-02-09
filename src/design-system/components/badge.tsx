import { type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

/**
 * Badge Component
 *
 * Design rationale:
 * - Compact visual indicator for status, categories, counts
 * - Uses semantic colors with subtle backgrounds (not fully saturated)
 * - Pill shape (full radius) for visual softness
 * - Small text with medium weight for legibility at compact size
 * - Border adds definition without heaviness on dark backgrounds
 */
const badgeVariants = cva(
  [
    "inline-flex items-center",
    "rounded-[var(--radius-full)] border",
    "text-[var(--text-xs)] font-[var(--font-medium)]",
    "px-[var(--space-2)] py-[var(--space-0-5)]",
    "leading-[var(--leading-normal)]",
    "select-none whitespace-nowrap",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "border-[var(--border-default)] bg-[var(--bg-overlay)]",
          "text-[var(--fg-muted)]",
        ].join(" "),
        primary: [
          "border-[var(--color-primary-800)] bg-[var(--accent-subtle)]",
          "text-[var(--color-primary-400)]",
        ].join(" "),
        success: [
          "border-[var(--status-success-border)] bg-[var(--status-success-bg)]",
          "text-[var(--status-success)]",
        ].join(" "),
        warning: [
          "border-[var(--status-warning-border)] bg-[var(--status-warning-bg)]",
          "text-[var(--status-warning)]",
        ].join(" "),
        danger: [
          "border-[var(--status-danger-border)] bg-[var(--status-danger-bg)]",
          "text-[var(--status-danger)]",
        ].join(" "),
        info: [
          "border-[var(--status-info-border)] bg-[var(--status-info-bg)]",
          "text-[var(--status-info)]",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants, type BadgeProps };
