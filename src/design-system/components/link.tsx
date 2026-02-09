import NextLink, { type LinkProps as NextLinkProps } from "next/link";
import { forwardRef, type AnchorHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

/**
 * Link Component
 *
 * Design rationale:
 * - Links should be distinguishable from regular text (WCAG 1.4.1)
 * - Accent color + underline on hover for clear affordance
 * - External links open in new tab with security attributes
 * - Integrates with Next.js Link for client-side navigation
 */
const linkVariants = cva(
  "transition-colors duration-150 ease-out inline-flex items-center gap-1",
  {
    variants: {
      variant: {
        default: [
          "text-[var(--accent-default)]",
          "hover:text-[var(--accent-hover)] hover:underline",
          "underline-offset-4",
        ].join(" "),
        muted: [
          "text-[var(--fg-muted)]",
          "hover:text-[var(--fg-default)]",
        ].join(" "),
        nav: [
          "text-[var(--text-sm)] text-[var(--fg-muted)]",
          "hover:text-[var(--fg-default)]",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface AppLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof NextLinkProps>,
    NextLinkProps,
    VariantProps<typeof linkVariants> {
  external?: boolean;
}

const AppLink = forwardRef<HTMLAnchorElement, AppLinkProps>(
  ({ className, variant, external, children, ...props }, ref) => {
    const externalProps = external
      ? { target: "_blank", rel: "noopener noreferrer" }
      : {};

    return (
      <NextLink
        ref={ref}
        className={cn(linkVariants({ variant }), className)}
        {...externalProps}
        {...props}
      >
        {children}
        {external && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-50"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        )}
      </NextLink>
    );
  }
);

AppLink.displayName = "AppLink";

export { AppLink, linkVariants, type AppLinkProps };
