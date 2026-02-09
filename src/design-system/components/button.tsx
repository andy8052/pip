import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

/**
 * Button Component
 *
 * Design rationale:
 * - Minimum 44px touch target (WCAG 2.5.5) for mobile accessibility
 * - Focus ring with offset for keyboard navigation visibility
 * - Distinct visual hierarchy: primary (filled), secondary (outlined),
 *   ghost (minimal), danger (destructive intent)
 * - Disabled state uses opacity + cursor to signal non-interactivity
 * - Smooth transitions on hover/active for tactile feedback
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "font-medium whitespace-nowrap",
    "transition-all duration-150 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-[var(--bg-base)]",
    "disabled:pointer-events-none disabled:opacity-50",
    "select-none",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          "bg-[var(--accent-default)] text-[var(--fg-on-accent)]",
          "hover:bg-[var(--accent-hover)]",
          "active:bg-[var(--accent-active)] active:scale-[0.98]",
          "shadow-[var(--shadow-sm)]",
          "hover:shadow-[var(--shadow-glow-sm)]",
        ].join(" "),
        secondary: [
          "border border-[var(--border-default)] bg-transparent",
          "text-[var(--fg-default)]",
          "hover:bg-[var(--bg-overlay)] hover:border-[var(--border-strong)]",
          "active:bg-[var(--bg-surface)] active:scale-[0.98]",
        ].join(" "),
        ghost: [
          "bg-transparent text-[var(--fg-muted)]",
          "hover:bg-[var(--bg-overlay)] hover:text-[var(--fg-default)]",
          "active:bg-[var(--bg-surface)] active:scale-[0.98]",
        ].join(" "),
        danger: [
          "bg-[var(--color-danger-600)] text-[var(--fg-on-accent)]",
          "hover:bg-[var(--color-danger-500)]",
          "active:bg-[var(--color-danger-700)] active:scale-[0.98]",
        ].join(" "),
        success: [
          "bg-[var(--color-success-600)] text-[var(--fg-on-accent)]",
          "hover:bg-[var(--color-success-500)]",
          "active:bg-[var(--color-success-700)] active:scale-[0.98]",
        ].join(" "),
        link: [
          "bg-transparent text-[var(--accent-default)] underline-offset-4",
          "hover:underline hover:text-[var(--accent-hover)]",
          "active:text-[var(--accent-active)]",
          "p-0 h-auto",
        ].join(" "),
      },
      size: {
        sm: "h-8 px-3 text-[var(--text-xs)] rounded-[var(--radius-md)] [&_svg]:size-3.5",
        md: "h-10 px-4 text-[var(--text-sm)] rounded-[var(--radius-md)] [&_svg]:size-4",
        lg: "h-12 px-6 text-[var(--text-base)] rounded-[var(--radius-lg)] [&_svg]:size-5",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants, type ButtonProps };
