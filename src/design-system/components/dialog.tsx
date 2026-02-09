"use client";

import {
  forwardRef,
  useEffect,
  useRef,
  useCallback,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../utils";

/**
 * Dialog Component
 *
 * Design rationale:
 * - Modal dialogs focus attention on a single task (Hick's Law: reduce choices)
 * - Backdrop overlay dims background to establish visual hierarchy
 * - Smooth scale + fade entrance for spatial context (where did this come from?)
 * - Focus trap keeps keyboard users within the dialog
 * - Escape key dismissal is expected behavior (Jakob's Law)
 * - Uses native <dialog> element for built-in accessibility
 *
 * Animation follows Material Design motion principles:
 * - Enter: scale from 95% + fade in (ease-out, 200ms)
 * - Exit: scale to 95% + fade out (ease-in, 150ms)
 */
interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

const Dialog = forwardRef<HTMLDialogElement, DialogProps>(
  ({ open, onClose, children, className }, ref) => {
    const internalRef = useRef<HTMLDialogElement>(null);
    const dialogRef = (ref as React.RefObject<HTMLDialogElement>) || internalRef;

    const handleClose = useCallback(() => {
      onClose();
    }, [onClose]);

    useEffect(() => {
      const dialog = dialogRef.current;
      if (!dialog) return;

      if (open && !dialog.open) {
        dialog.showModal();
      } else if (!open && dialog.open) {
        dialog.close();
      }
    }, [open, dialogRef]);

    useEffect(() => {
      const dialog = dialogRef.current;
      if (!dialog) return;

      const handleCancel = (e: Event) => {
        e.preventDefault();
        handleClose();
      };

      dialog.addEventListener("cancel", handleCancel);
      return () => dialog.removeEventListener("cancel", handleCancel);
    }, [dialogRef, handleClose]);

    return (
      <dialog
        ref={dialogRef}
        className={cn(
          /* Backdrop */
          "backdrop:bg-black/60 backdrop:backdrop-blur-sm",
          /* Reset dialog defaults */
          "bg-transparent p-0 m-0 max-w-none max-h-none",
          /* Centering */
          "fixed inset-0 z-[var(--z-modal)]",
          "flex items-center justify-center",
          /* Animation */
          "open:animate-in closed:animate-out",
          className
        )}
        onClick={(e) => {
          // Close on backdrop click
          if (e.target === e.currentTarget) handleClose();
        }}
      >
        <div
          className={cn(
            "relative w-full max-w-lg mx-[var(--space-4)]",
            "rounded-[var(--radius-xl)] border border-[var(--border-default)]",
            "bg-[var(--bg-raised)] shadow-[var(--shadow-2xl)]",
            "p-[var(--space-6)]",
          )}
        >
          {children}
        </div>
      </dialog>
    );
  }
);
Dialog.displayName = "Dialog";

const DialogHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-[var(--space-1-5)] mb-[var(--space-4)]",
        className
      )}
      {...props}
    />
  )
);
DialogHeader.displayName = "DialogHeader";

const DialogTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-[var(--text-lg)] font-[var(--font-semibold)] text-[var(--fg-default)]",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-[var(--text-sm)] text-[var(--fg-muted)]", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

const DialogFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-end gap-[var(--space-2)] mt-[var(--space-6)]",
        className
      )}
      {...props}
    />
  )
);
DialogFooter.displayName = "DialogFooter";

export {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  type DialogProps,
};
