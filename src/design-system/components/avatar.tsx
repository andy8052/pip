import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";
import { cn } from "../utils";

/**
 * Avatar Component
 *
 * Design rationale:
 * - Circular shape is universally recognized for user/entity identity
 * - Fallback displays first letter with a neutral background
 * - Consistent sizing scale matches text/button hierarchy
 * - Ring option for emphasis (e.g., current user, selected state)
 */
const avatarVariants = cva(
  [
    "relative inline-flex items-center justify-center",
    "shrink-0 overflow-hidden rounded-full",
    "bg-[var(--bg-overlay)] text-[var(--fg-subtle)]",
    "select-none",
  ].join(" "),
  {
    variants: {
      size: {
        xs: "size-6 text-[10px]",
        sm: "size-8 text-[var(--text-xs)]",
        md: "size-10 text-[var(--text-sm)]",
        lg: "size-12 text-[var(--text-base)]",
        xl: "size-16 text-[var(--text-lg)]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

interface AvatarProps
  extends VariantProps<typeof avatarVariants> {
  src?: string | null;
  alt?: string;
  fallback?: string;
  className?: string;
}

/** Map size variant to pixel dimensions for Next.js Image */
const sizePxMap = { xs: 24, sm: 32, md: 40, lg: 48, xl: 64 };

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, src, alt, fallback, ...props }, ref) => {
    const fallbackChar = fallback?.[0]?.toUpperCase() ?? "?";
    const px = sizePxMap[size ?? "md"];

    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ size }), className)}
        {...props}
      >
        {src ? (
          <Image
            src={src}
            alt={alt ?? ""}
            width={px}
            height={px}
            className="aspect-square size-full object-cover"
            unoptimized
          />
        ) : (
          <span className="font-[var(--font-semibold)]">{fallbackChar}</span>
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

export { Avatar, avatarVariants, type AvatarProps };
