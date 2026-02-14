import { useEffect } from "react";

import { Button } from "@/src/components/ui/button";

export const Dialog = ({
  open,
  title,
  description,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-text-primary/40 p-4" role="presentation" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-md rounded-xl border border-border bg-surface p-5 shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        {description ? <p className="mt-1 text-sm text-text-secondary">{description}</p> : null}
        <div className="mt-4">{children}</div>
        <div className="mt-5 flex justify-end">
          <Button variant="secondary" onClick={onClose} ariaLabel="Close dialog">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
