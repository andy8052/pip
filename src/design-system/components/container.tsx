import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../utils";

/**
 * Container Component
 *
 * Design rationale:
 * - Centers content and constrains max-width for optimal reading measure
 * - Optimal line length: 45-75 characters (Bringhurst's Elements of Typographic Style)
 * - Responsive horizontal padding prevents edge-to-edge text on mobile
 * - Uses the container-max token for consistency across pages
 */
interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** Constrain to a narrower width for focused content */
  narrow?: boolean;
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, narrow, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "mx-auto w-full px-[var(--container-padding)]",
          narrow ? "max-w-2xl" : "max-w-[var(--container-max)]",
          className
        )}
        {...props}
      />
    );
  }
);

Container.displayName = "Container";

export { Container, type ContainerProps };
