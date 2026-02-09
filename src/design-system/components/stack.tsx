import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

/**
 * Stack Component
 *
 * Design rationale:
 * - Consistent vertical/horizontal spacing is the backbone of layout
 * - Flexbox gap-based (not margin) for cleaner spacing model
 * - Named gap sizes map to the spacing scale for rhythm
 * - Replaces ad-hoc "space-y-*" classes with intentional semantics
 *
 * Gestalt principle of proximity: items in a Stack are perceived
 * as a group. The gap size signals relationship tightness.
 */
const stackVariants = cva("flex", {
  variants: {
    direction: {
      vertical: "flex-col",
      horizontal: "flex-row",
    },
    gap: {
      none: "gap-0",
      xs: "gap-[var(--space-1)]",
      sm: "gap-[var(--space-2)]",
      md: "gap-[var(--space-4)]",
      lg: "gap-[var(--space-6)]",
      xl: "gap-[var(--space-8)]",
      "2xl": "gap-[var(--space-12)]",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
      baseline: "items-baseline",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
    },
    wrap: {
      true: "flex-wrap",
      false: "flex-nowrap",
    },
  },
  defaultVariants: {
    direction: "vertical",
    gap: "md",
    align: "stretch",
    justify: "start",
    wrap: false,
  },
});

interface StackProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stackVariants> {}

const Stack = forwardRef<HTMLDivElement, StackProps>(
  ({ className, direction, gap, align, justify, wrap, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          stackVariants({ direction, gap, align, justify, wrap }),
          className
        )}
        {...props}
      />
    );
  }
);

Stack.displayName = "Stack";

/**
 * HStack — Convenience wrapper for horizontal Stack.
 */
const HStack = forwardRef<HTMLDivElement, Omit<StackProps, "direction">>(
  (props, ref) => <Stack ref={ref} direction="horizontal" {...props} />
);
HStack.displayName = "HStack";

/**
 * VStack — Convenience wrapper for vertical Stack.
 */
const VStack = forwardRef<HTMLDivElement, Omit<StackProps, "direction">>(
  (props, ref) => <Stack ref={ref} direction="vertical" {...props} />
);
VStack.displayName = "VStack";

export { Stack, HStack, VStack, stackVariants, type StackProps };
