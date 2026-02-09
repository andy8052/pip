import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

/**
 * IconButton Component
 *
 * Square button for icon-only actions.
 * Always requires an aria-label for accessibility.
 * Maintains equal width/height for visual harmony.
 */
const iconButtonVariants = cva(
  [
    "inline-flex items-center justify-center",
    "transition-all duration-150 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-[var(--bg-base)]",
    "disabled:pointer-events-none disabled:opacity-50",
    "select-none rounded-[var(--radius-md)]",
    "[&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        ghost: [
          "bg-transparent text-[var(--fg-muted)]",
          "hover:bg-[var(--bg-overlay)] hover:text-[var(--fg-default)]",
          "active:bg-[var(--bg-surface)]",
        ].join(" "),
        secondary: [
          "border border-[var(--border-default)] bg-transparent",
          "text-[var(--fg-muted)]",
          "hover:bg-[var(--bg-overlay)] hover:text-[var(--fg-default)]",
          "hover:border-[var(--border-strong)]",
        ].join(" "),
        danger: [
          "bg-transparent text-[var(--fg-muted)]",
          "hover:bg-[var(--status-danger-bg)] hover:text-[var(--status-danger)]",
        ].join(" "),
      },
      size: {
        sm: "size-8 [&_svg]:size-3.5",
        md: "size-10 [&_svg]:size-4",
        lg: "size-12 [&_svg]:size-5",
      },
    },
    defaultVariants: {
      variant: "ghost",
      size: "md",
    },
  }
);

interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  "aria-label": string;
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(iconButtonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);

IconButton.displayName = "IconButton";

export { IconButton, iconButtonVariants, type IconButtonProps };
