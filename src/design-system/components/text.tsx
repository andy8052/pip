import { forwardRef, type HTMLAttributes, type ElementType } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

/**
 * Text Component
 *
 * Design rationale:
 * - Typography is the primary vehicle for information hierarchy
 * - Size + weight + color create a clear reading order
 * - Semantic HTML elements (h1-h6, p) for accessibility and SEO
 * - Line height decreases as text size increases (headings are tighter)
 * - Letter spacing tightens for large display text (improves cohesion)
 *
 * Based on the Major Third (1.25) modular type scale.
 */
const textVariants = cva("", {
  variants: {
    variant: {
      /* Display / Hero — for landing page headlines (responsive via token) */
      display: [
        "text-[var(--text-display)] font-[var(--font-bold)]",
        "leading-[var(--leading-none)] tracking-[var(--tracking-tighter)]",
        "text-[var(--fg-default)]",
      ].join(" "),
      /* H1 — Page title (responsive via token) */
      h1: [
        "text-[var(--text-page-title)] font-[var(--font-bold)]",
        "leading-[var(--leading-tight)] tracking-[var(--tracking-tight)]",
        "text-[var(--fg-default)]",
      ].join(" "),
      /* H2 — Section title */
      h2: [
        "text-[var(--text-2xl)] font-[var(--font-semibold)]",
        "leading-[var(--leading-tight)] tracking-[var(--tracking-tight)]",
        "text-[var(--fg-default)]",
      ].join(" "),
      /* H3 — Subsection title */
      h3: [
        "text-[var(--text-xl)] font-[var(--font-semibold)]",
        "leading-[var(--leading-snug)]",
        "text-[var(--fg-default)]",
      ].join(" "),
      /* H4 — Card/group title */
      h4: [
        "text-[var(--text-lg)] font-[var(--font-semibold)]",
        "leading-[var(--leading-snug)]",
        "text-[var(--fg-default)]",
      ].join(" "),
      /* Body — Default paragraph text */
      body: [
        "text-[var(--text-base)] font-[var(--font-normal)]",
        "leading-[var(--leading-normal)]",
        "text-[var(--fg-default)]",
      ].join(" "),
      /* Body small — Secondary content */
      "body-sm": [
        "text-[var(--text-sm)] font-[var(--font-normal)]",
        "leading-[var(--leading-normal)]",
        "text-[var(--fg-muted)]",
      ].join(" "),
      /* Caption — Metadata, timestamps */
      caption: [
        "text-[var(--text-xs)] font-[var(--font-normal)]",
        "leading-[var(--leading-normal)]",
        "text-[var(--fg-subtle)]",
      ].join(" "),
      /* Label — Form labels, small headings */
      label: [
        "text-[var(--text-sm)] font-[var(--font-medium)]",
        "leading-[var(--leading-normal)]",
        "text-[var(--fg-muted)]",
      ].join(" "),
      /* Overline — Small uppercase category labels */
      overline: [
        "text-[var(--text-xs)] font-[var(--font-semibold)]",
        "leading-[var(--leading-normal)] tracking-[var(--tracking-widest)]",
        "text-[var(--fg-subtle)] uppercase",
      ].join(" "),
      /* Code — Inline code/addresses */
      code: [
        "font-[var(--font-family-mono)] text-[var(--text-sm)]",
        "leading-[var(--leading-normal)]",
        "text-[var(--fg-muted)]",
      ].join(" "),
    },
    tone: {
      default: "",
      muted: "text-[var(--fg-muted)]",
      subtle: "text-[var(--fg-subtle)]",
      accent: "text-[var(--accent-default)]",
      success: "text-[var(--status-success)]",
      warning: "text-[var(--status-warning)]",
      danger: "text-[var(--status-danger)]",
      info: "text-[var(--status-info)]",
      inherit: "text-inherit",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    truncate: {
      true: "truncate",
      false: "",
    },
  },
  defaultVariants: {
    variant: "body",
      tone: "default",
    align: "left",
    truncate: false,
  },
});

/** Map variant names to sensible default HTML elements */
const variantElementMap: Record<string, ElementType> = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  body: "p",
  "body-sm": "p",
  caption: "span",
  label: "label",
  overline: "span",
  code: "code",
};

interface TextProps
  extends Omit<HTMLAttributes<HTMLElement>, "color">,
    VariantProps<typeof textVariants> {
  /** Override the rendered HTML element */
  as?: ElementType;
  /** Semantic color tone */
  color?: TextProps["tone"];
}

const Text = forwardRef<HTMLElement, TextProps>(
  ({ className, variant, tone, color, align, truncate, as, ...props }, ref) => {
    const Component = as || variantElementMap[variant ?? "body"] || "p";
    const resolvedTone = tone ?? color ?? "default";

    return (
      <Component
        ref={ref}
        className={cn(textVariants({ variant, tone: resolvedTone, align, truncate }), className)}
        {...props}
      />
    );
  }
);

Text.displayName = "Text";

export { Text, textVariants, type TextProps };
