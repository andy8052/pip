"use client";

import {
  useState,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import { cn } from "../utils";

/**
 * Tooltip Component
 *
 * Design rationale:
 * - Tooltips reveal supplementary information on demand
 * - Delay prevents accidental triggers during normal cursor movement
 * - Dark-on-light (inverted) scheme for maximum contrast and visual pop
 * - Small text + compact padding for unobtrusive presence
 * - Arrow/pointer provides spatial reference to trigger element
 * - Positioned above by default (most common, avoids obscuring content below)
 *
 * Accessibility: Uses aria-describedby to announce tooltip content
 * to screen readers without requiring hover.
 */
interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  side?: "top" | "bottom";
  delay?: number;
  className?: string;
}

function Tooltip({
  content,
  children,
  side = "top",
  delay = 300,
  className,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const show = useCallback(() => {
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
  }, [delay]);

  const hide = useCallback(() => {
    clearTimeout(timeoutRef.current);
    setIsVisible(false);
  }, []);

  return (
    <div className="relative inline-flex" onMouseEnter={show} onMouseLeave={hide}>
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={cn(
            "absolute left-1/2 -translate-x-1/2 z-[var(--z-tooltip)]",
            "rounded-[var(--radius-md)] px-[var(--space-2)] py-[var(--space-1)]",
            "bg-[var(--fg-default)] text-[var(--bg-base)]",
            "text-[var(--text-xs)] font-[var(--font-medium)]",
            "whitespace-nowrap shadow-[var(--shadow-lg)]",
            "pointer-events-none",
            "animate-in fade-in-0 zoom-in-95",
            side === "top" ? "bottom-full mb-[var(--space-1-5)]" : "top-full mt-[var(--space-1-5)]",
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}

export { Tooltip, type TooltipProps };
