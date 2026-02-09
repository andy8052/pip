import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "../utils";

/**
 * Textarea Component
 *
 * Shares styling language with Input for consistency.
 * Auto-sizing can be achieved via CSS field-sizing in modern browsers.
 */
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  hasError?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, hasError, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const showError = error || hasError;

    return (
      <div className="flex flex-col gap-[var(--space-1)]">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-[var(--text-sm)] font-[var(--font-medium)] text-[var(--fg-muted)]"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            "flex min-h-20 w-full px-3 py-2",
            "border bg-[var(--bg-raised)] text-[var(--fg-default)]",
            "rounded-[var(--radius-md)] text-[var(--text-sm)]",
            "placeholder:text-[var(--fg-subtle)]",
            "transition-colors duration-150 ease-out",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0",
            "focus-visible:ring-[var(--ring-color)] focus-visible:border-[var(--border-focus)]",
            "disabled:pointer-events-none disabled:opacity-50",
            "resize-y",
            showError
              ? "border-[var(--status-danger)] focus-visible:ring-[var(--status-danger)]"
              : "border-[var(--border-default)]",
            className
          )}
          aria-invalid={!!showError}
          {...props}
        />
        {error && (
          <p className="text-[var(--text-xs)] text-[var(--status-danger)]" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-[var(--text-xs)] text-[var(--fg-subtle)]">{hint}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea, type TextareaProps };
