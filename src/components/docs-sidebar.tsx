"use client";

import { useEffect, useState, useCallback } from "react";
import { cn } from "@/design-system/utils";
import { Text } from "@/design-system";

/* ─────────────────────────────────────────────────────────────────────────────
 * TYPES
 * ────────────────────────────────────────────────────────────────────────── */

interface DocSection {
  id: string;
  title: string;
  children?: { id: string; title: string }[];
}

interface DocsSidebarProps {
  sections: DocSection[];
}

/* ─────────────────────────────────────────────────────────────────────────────
 * ICONS
 * ────────────────────────────────────────────────────────────────────────── */

function IconMenu({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function IconX({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * SIDEBAR COMPONENT
 * ────────────────────────────────────────────────────────────────────────── */

export function DocsSidebar({ sections }: DocsSidebarProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  /* Scroll-spy: observe section headings and update active ID */
  useEffect(() => {
    const allIds = sections.flatMap((s) => [
      s.id,
      ...(s.children?.map((c) => c.id) ?? []),
    ]);

    const observer = new IntersectionObserver(
      (entries) => {
        /* Find the first visible entry from the top */
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-80px 0px -60% 0px",
        threshold: 0,
      }
    );

    allIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  const handleClick = useCallback(
    (id: string) => {
      setActiveId(id);
      setIsOpen(false);
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: "smooth" });
      }
    },
    []
  );

  const isActive = (id: string) => activeId === id;
  const isParentActive = (section: DocSection) =>
    activeId === section.id ||
    (section.children?.some((c) => c.id === activeId) ?? false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-[var(--space-4)] right-[var(--space-4)] z-[var(--z-overlay)]",
          "flex size-12 items-center justify-center rounded-full",
          "bg-[var(--accent-default)] text-white shadow-[var(--shadow-lg)]",
          "transition-all duration-200 hover:bg-[var(--accent-hover)]",
          "lg:hidden"
        )}
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
      >
        {isOpen ? <IconX /> : <IconMenu />}
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[var(--z-overlay)] bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-[var(--z-modal)] h-dvh w-72 overflow-y-auto",
          "border-r border-[var(--border-default)] bg-[var(--bg-subtle)]",
          "pt-[64px] pb-[var(--space-8)]",
          "transition-transform duration-300 ease-out",
          "lg:sticky lg:top-[48px] lg:z-auto lg:h-[calc(100dvh-48px)] lg:translate-x-0 lg:pt-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="px-[var(--space-4)] py-[var(--space-6)]">
          <Text
            variant="overline"
            color="accent"
            as="span"
            className="mb-[var(--space-4)] block px-[var(--space-2)]"
          >
            Documentation
          </Text>

          <nav aria-label="Documentation navigation">
            <ul className="flex flex-col gap-[var(--space-0-5)]">
              {sections.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => handleClick(section.id)}
                    className={cn(
                      "flex w-full items-center rounded-[var(--radius-md)] px-[var(--space-2)] py-[var(--space-1-5)]",
                      "text-left text-[var(--text-sm)] font-[var(--font-medium)]",
                      "transition-colors duration-150",
                      isParentActive(section)
                        ? "bg-[var(--accent-subtle)] text-[var(--accent-default)]"
                        : "text-[var(--fg-muted)] hover:bg-[var(--bg-overlay)] hover:text-[var(--fg-default)]"
                    )}
                  >
                    {section.title}
                  </button>

                  {/* Children */}
                  {section.children && section.children.length > 0 && (
                    <ul className="ml-[var(--space-2)] mt-[var(--space-0-5)] flex flex-col gap-[var(--space-0-5)] border-l border-[var(--border-default)] pl-[var(--space-3)]">
                      {section.children.map((child) => (
                        <li key={child.id}>
                          <button
                            onClick={() => handleClick(child.id)}
                            className={cn(
                              "flex w-full items-center rounded-[var(--radius-md)] px-[var(--space-2)] py-[var(--space-1)]",
                              "text-left text-[var(--text-sm)]",
                              "transition-colors duration-150",
                              isActive(child.id)
                                ? "text-[var(--accent-default)]"
                                : "text-[var(--fg-subtle)] hover:text-[var(--fg-muted)]"
                            )}
                          >
                            {child.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
