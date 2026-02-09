import { clsx, type ClassValue } from "clsx";

/**
 * Merge class names with deduplication awareness.
 * Combines clsx for conditional classes.
 * In a Tailwind v4 project without tailwind-merge, we rely on
 * CSS cascade order (later classes win). For most cases this works
 * perfectly because our components use well-scoped variant classes.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/**
 * Slot-based prop forwarding for compound components.
 * Allows parent components to pass className/style to child slots.
 */
export interface SlotProps {
  className?: string;
  style?: React.CSSProperties;
}
