"use client";

import { forwardRef, useRef, type InputHTMLAttributes } from "react";
import { cn } from "../utils";

/**
 * FileUpload Component
 *
 * Design rationale:
 * - Dashed border signals "drop zone" affordance (convention from desktop UIs)
 * - Icon + text combination for clear instruction (dual coding theory)
 * - Hover state transforms border from dashed to solid for feedback
 * - Preview state shows thumbnail for confirmation (recognition over recall)
 * - Accepts file type constraints via standard input[type=file] attributes
 *
 * UX principle: Show, don't tell — the preview confirms the upload
 * more effectively than a filename alone.
 */
interface FileUploadProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  label?: string;
  hint?: string;
  error?: string;
  onFileSelect: (file: File | null) => void;
  preview?: string | null;
  fileName?: string;
  fileSize?: string;
  onClear?: () => void;
}

const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  (
    {
      className,
      label,
      hint,
      error,
      onFileSelect,
      preview,
      fileName,
      fileSize,
      onClear,
      id,
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLInputElement>(null);
    const inputRef = (ref as React.RefObject<HTMLInputElement>) || internalRef;
    const inputId = id || "file-upload";

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const file = e.target.files?.[0] ?? null;
      onFileSelect(file);
    }

    function handleClear() {
      if (inputRef.current) inputRef.current.value = "";
      onClear?.();
      onFileSelect(null);
    }

    return (
      <div className={cn("flex flex-col gap-[var(--space-1)]", className)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-[var(--text-sm)] font-[var(--font-medium)] text-[var(--fg-muted)]"
          >
            {label}
          </label>
        )}

        {preview ? (
          <div
            className={cn(
              "flex items-center gap-[var(--space-3)]",
              "rounded-[var(--radius-lg)] border border-[var(--border-default)]",
              "bg-[var(--bg-raised)] p-[var(--space-3)]"
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Upload preview"
              className="size-12 rounded-[var(--radius-md)] object-cover"
            />
            <div className="flex-1 min-w-0">
              {fileName && (
                <p className="text-[var(--text-sm)] text-[var(--fg-default)] truncate">
                  {fileName}
                </p>
              )}
              {fileSize && (
                <p className="text-[var(--text-xs)] text-[var(--fg-subtle)]">
                  {fileSize}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={handleClear}
              className={cn(
                "rounded-[var(--radius-md)] p-[var(--space-1)]",
                "text-[var(--fg-muted)]",
                "hover:text-[var(--fg-default)] hover:bg-[var(--bg-overlay)]",
                "transition-colors duration-150"
              )}
              aria-label="Remove file"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={cn(
              "w-full rounded-[var(--radius-lg)]",
              "border border-dashed",
              error
                ? "border-[var(--status-danger)]"
                : "border-[var(--border-default)]",
              "bg-[var(--bg-raised)]",
              "px-[var(--space-3)] py-[var(--space-4)] sm:py-[var(--space-6)]",
              "text-[var(--fg-subtle)]",
              "hover:border-[var(--border-strong)] hover:text-[var(--fg-muted)]",
              "transition-colors duration-150",
              "flex flex-col items-center gap-[var(--space-2)]"
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span className="text-[var(--text-sm)]">Click to upload</span>
            {hint && (
              <span className="text-[var(--text-xs)]">{hint}</span>
            )}
          </button>
        )}

        <input
          ref={inputRef}
          id={inputId}
          type="file"
          onChange={handleChange}
          className="hidden"
          {...props}
        />

        {error && (
          <p className="text-[var(--text-xs)] text-[var(--status-danger)]" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FileUpload.displayName = "FileUpload";

export { FileUpload, type FileUploadProps };
