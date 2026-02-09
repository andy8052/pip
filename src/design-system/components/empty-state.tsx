import { type ReactNode, type HTMLAttributes } from "react";
import { cn } from "../utils";

/**
 * EmptyState Component
 *
 * Design rationale:
 * - Empty states are critical UX moments — they guide users to take action
 * - Icon/illustration + message + CTA pattern (Fogg Behavior Model:
 *   motivation + ability + prompt = action)
 * - Centered layout draws focus and feels less "broken" than a blank area
 * - Muted text prevents the empty state from feeling like an error
 */
interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
}

function EmptyState({
  className,
  icon,
  title,
  description,
  action,
  children,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        "py-[var(--space-12)] px-[var(--space-4)]",
        "text-center",
        className
      )}
      {...props}
    >
      {icon && (
        <div className="mb-[var(--space-4)] text-[var(--fg-faint)]">{icon}</div>
      )}
      {title && (
        <h3 className="text-[var(--text-lg)] font-[var(--font-semibold)] text-[var(--fg-default)] mb-[var(--space-1)]">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-[var(--text-sm)] text-[var(--fg-muted)] max-w-sm mb-[var(--space-4)]">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
      {children}
    </div>
  );
}

export { EmptyState, type EmptyStateProps };
