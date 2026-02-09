/**
 * ==========================================================================
 * PIP DESIGN SYSTEM
 * ==========================================================================
 *
 * A complete, token-driven design system built on established principles
 * from design theory, color theory, typography, and UX research.
 *
 * ARCHITECTURE
 * ─────────────
 * 1. Tokens (CSS)     → tokens.css — Design decisions as CSS custom properties
 * 2. Utilities         → utils.ts — cn() helper and shared types
 * 3. Primitives        → Button, IconButton, Input, Textarea
 * 4. Display           → Card, Badge, Alert, Avatar, Skeleton, Spinner
 * 5. Layout            → Stack, HStack, VStack, Container, Separator
 * 6. Typography        → Text (display, h1-h4, body, caption, label, code)
 * 7. Overlays          → Dialog, Tooltip
 * 8. Specialized       → FileUpload, EmptyState, Logo, AppLink
 *
 * DESIGN FOUNDATIONS
 * ─────────────────
 * Color Theory:
 *   - 60-30-10 Rule: 60% neutral bg, 30% surface, 10% accent
 *   - WCAG AA contrast: All text ≥ 4.5:1 ratio on its background
 *   - Semantic color mapping: meaning → color, not component → color
 *   - Dark-first: Palette tuned for vibrancy and legibility on dark surfaces
 *
 * Typography:
 *   - Major Third (1.25) modular scale for harmonious size progression
 *   - Tighter leading for headings, generous for body text
 *   - Weight as hierarchy: bold for titles, medium for labels, normal for body
 *   - Optimal measure: Container constrains line length to 45-75 characters
 *
 * Spacing & Layout:
 *   - 8px grid with 4px half-steps for fine-tuning
 *   - Consistent rhythm via gap-based layouts (flexbox gap, not margins)
 *   - Progressive spacing: more space = more visual separation = more importance
 *
 * Interaction Design:
 *   - Minimum 44px touch targets (WCAG 2.5.5)
 *   - Focus ring with offset for keyboard navigation
 *   - Hover, active, disabled states on all interactive elements
 *   - Reduced motion support: respects prefers-reduced-motion
 *
 * Motion:
 *   - Meaningful: animations communicate state change, not decoration
 *   - 150ms for micro-interactions, 300ms for transitions, 500ms for emphasis
 *   - ease-out for entrances, ease-in for exits
 *
 * Gestalt Principles:
 *   - Proximity: Stack gap sizes signal relationship tightness
 *   - Similarity: Semantic colors create visual grouping
 *   - Continuity: Consistent spacing rhythm guides eye flow
 *   - Figure-ground: Elevated cards stand out from base background
 *
 * ==========================================================================
 */

// Utilities
export { cn } from "./utils";
export type { SlotProps } from "./utils";

// Primitives
export { Button, buttonVariants } from "./components/button";
export type { ButtonProps } from "./components/button";

export { IconButton, iconButtonVariants } from "./components/icon-button";
export type { IconButtonProps } from "./components/icon-button";

export { Input, inputVariants } from "./components/input";
export type { InputProps } from "./components/input";

export { Textarea } from "./components/textarea";
export type { TextareaProps } from "./components/textarea";

// Display
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  cardVariants,
} from "./components/card";
export type { CardProps } from "./components/card";

export { Badge, badgeVariants } from "./components/badge";
export type { BadgeProps } from "./components/badge";

export { Alert, AlertTitle, AlertDescription, alertVariants } from "./components/alert";
export type { AlertProps } from "./components/alert";

export { Avatar, avatarVariants } from "./components/avatar";
export type { AvatarProps } from "./components/avatar";

export { Skeleton } from "./components/skeleton";
export type { SkeletonProps } from "./components/skeleton";

export { Spinner, spinnerVariants } from "./components/spinner";
export type { SpinnerProps } from "./components/spinner";

// Layout
export { Stack, HStack, VStack, stackVariants } from "./components/stack";
export type { StackProps } from "./components/stack";

export { Container } from "./components/container";
export type { ContainerProps } from "./components/container";

export { Separator } from "./components/separator";
export type { SeparatorProps } from "./components/separator";

// Typography
export { Text, textVariants } from "./components/text";
export type { TextProps } from "./components/text";

// Overlays
export {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./components/dialog";
export type { DialogProps } from "./components/dialog";

export { Tooltip } from "./components/tooltip";
export type { TooltipProps } from "./components/tooltip";

// Specialized
export { FileUpload } from "./components/file-upload";
export type { FileUploadProps } from "./components/file-upload";

export { EmptyState } from "./components/empty-state";
export type { EmptyStateProps } from "./components/empty-state";

export { Logo } from "./components/logo";
export type { LogoProps } from "./components/logo";

export { AppLink, linkVariants } from "./components/link";
export type { AppLinkProps } from "./components/link";
