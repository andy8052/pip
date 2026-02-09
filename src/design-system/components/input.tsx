import { forwardRef, type InputHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

/**
 * Input Component
 *
 * Design rationale:
 * - Clear focus states with ring for keyboard navigation
 * - Subtle background to distinguish from page surface
 * - Consistent height with Button for alignment in inline forms
 * - Placeholder styled lighter than input text for visual hierarchy
 * - Error state uses danger color on border for instant recognition
 */
const inputVariants = cva(
  [
    "flex w-full",
    "border bg-[var(--bg-raised)] text-[var(--fg-default)]",
    "placeholder:text-[var(--fg-subtle)]",
    "transition-colors duration-150 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0",
    "focus-visible:ring-[var(--ring-color)] focus-visible:border-[var(--border-focus)]",
    "disabled:pointer-events-none disabled:opacity-50",
    "file:border-0 file:bg-transparent file:text-[var(--text-sm)] file:font-medium",
  ].join(" "),
  {
    variants: {
      inputSize: {
        sm: "h-8 px-3 text-[var(--text-xs)] rounded-[var(--radius-md)]",
        md: "h-10 px-3 text-[var(--text-sm)] rounded-[var(--radius-md)]",
        lg: "h-12 px-4 text-[var(--text-base)] rounded-[var(--radius-lg)]",
      },
      hasError: {
        true: "border-[var(--status-danger)] focus-visible:ring-[var(--status-danger)]",
        false: "border-[var(--border-default)]",
      },
    },
    defaultVariants: {
      inputSize: "md",
      hasError: false,
    },
  }
);

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, inputSize, hasError, label, error, hint, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const showError = error || hasError;

    return (
      <div className="flex flex-col gap-[var(--space-1)]">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[var(--text-sm)] font-[var(--font-medium)] text-[var(--fg-muted)]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            inputVariants({ inputSize, hasError: !!showError }),
            className
          )}
          aria-invalid={!!showError}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          {...props}
        />
        {error && (
          <p
            id={`${inputId}-error`}
            className="text-[var(--text-xs)] text-[var(--status-danger)]"
            role="alert"
          >
            {error}
          </p>
        )}
        {hint && !error && (
          <p
            id={`${inputId}-hint`}
            className="text-[var(--text-xs)] text-[var(--fg-subtle)]"
          >
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, inputVariants, type InputProps };
