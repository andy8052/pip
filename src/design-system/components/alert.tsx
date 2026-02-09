import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

/**
 * Alert Component
 *
 * Design rationale:
 * - Inline feedback for form results, errors, and notifications
 * - Color-coded borders and backgrounds for instant recognition
 *   (Gestalt: similarity principle — same color = same meaning)
 * - Icon slot for additional affordance (color + shape redundancy)
 * - ARIA role="alert" for screen readers on error/danger variants
 */
const alertVariants = cva(
  [
    "relative w-full rounded-[var(--radius-lg)] border p-[var(--space-3)]",
    "text-[var(--text-sm)]",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "border-[var(--border-default)] bg-[var(--bg-surface)]",
          "text-[var(--fg-muted)]",
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

interface AlertProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role={variant === "danger" ? "alert" : "status"}
        className={cn(alertVariants({ variant }), className)}
        {...props}
      />
    );
  }
);
Alert.displayName = "Alert";

const AlertTitle = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn(
      "mb-[var(--space-1)] font-[var(--font-medium)] leading-[var(--leading-normal)]",
      className
    )}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-[var(--text-sm)] opacity-90 [&_p]:leading-[var(--leading-relaxed)]",
      className
    )}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export {
  Alert,
  AlertTitle,
  AlertDescription,
  alertVariants,
  type AlertProps,
};
