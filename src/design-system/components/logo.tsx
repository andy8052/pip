import { cn } from "../utils";

/**
 * Logo Component
 *
 * Design rationale:
 * - Brand mark is the most recognizable element — keep it simple
 * - Bold weight + consistent size creates visual anchor
 * - Link behavior for navigation affordance (logo = home is universal)
 * - Size variants for header vs. hero usage
 */
interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: "text-[var(--text-lg)] font-[var(--font-bold)]",
  md: "text-[var(--text-xl)] font-[var(--font-bold)]",
  lg: "text-[var(--text-3xl)] font-[var(--font-bold)]",
  xl: "text-[var(--text-4xl)] font-[var(--font-bold)]",
};

function Logo({ size = "md", className }: LogoProps) {
  return (
    <span
      className={cn(
        sizeMap[size],
        "text-[var(--fg-default)] tracking-[var(--tracking-tight)]",
        "select-none",
        className
      )}
    >
      pip
    </span>
  );
}

export { Logo, type LogoProps };
