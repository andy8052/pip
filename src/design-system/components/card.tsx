import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

/**
 * Card Component
 *
 * Design rationale:
 * - Cards are the primary surface container (the "30%" in 60-30-10)
 * - Subtle border + background lift creates depth without heavy shadows
 * - Consistent padding provides rhythm and breathing room
 * - Hover variant for interactive cards (e.g., clickable token cards)
 * - Compound component pattern: Card, CardHeader, CardContent, CardFooter
 */
const cardVariants = cva(
  [
    "rounded-[var(--radius-lg)] border border-[var(--border-default)]",
    "bg-[var(--bg-raised)]",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "",
        elevated: "shadow-[var(--shadow-md)]",
        interactive: [
          "transition-all duration-200 ease-out cursor-pointer",
          "hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)]",
          "hover:translate-y-[-1px]",
          "active:translate-y-0 active:shadow-[var(--shadow-sm)]",
        ].join(" "),
        ghost: "border-transparent bg-transparent",
      },
      padding: {
        none: "",
        sm: "p-[var(--space-2)] sm:p-[var(--space-3)]",
        md: "p-[var(--space-3)] sm:p-[var(--space-4)]",
        lg: "p-[var(--space-4)] sm:p-[var(--space-6)]",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
    },
  }
);

interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding }), className)}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col gap-[var(--space-1-5)]", className)}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "text-[var(--text-lg)] font-[var(--font-semibold)] leading-[var(--leading-tight)] text-[var(--fg-default)]",
        className
      )}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-[var(--text-sm)] text-[var(--fg-muted)]", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-[var(--space-2)] pt-[var(--space-3)]",
        className
      )}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  cardVariants,
  type CardProps,
};
