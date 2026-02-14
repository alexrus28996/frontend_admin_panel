import { useEffect, useRef, useState } from "react";

import { Button } from "@/src/components/ui/button";

interface DropdownItem {
  label: string;
  onSelect: () => void;
}

export const DropdownMenu = ({ triggerLabel, items }: { triggerLabel: string; items: DropdownItem[] }) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  return (
    <div className="relative" ref={rootRef}>
      <Button ariaLabel={triggerLabel} variant="secondary" className="h-9 px-3" onClick={() => setOpen((prev) => !prev)}>
        {triggerLabel}
      </Button>
      {open ? (
        <ul className="absolute right-0 z-20 mt-2 min-w-40 rounded-md border border-border bg-surface p-1 shadow-md" role="menu" aria-label={triggerLabel}>
          {items.map((item) => (
            <li key={item.label}>
              <button
                className="w-full rounded px-3 py-2 text-left text-sm text-text-primary transition-colors duration-200 hover:bg-surface-muted"
                role="menuitem"
                onClick={() => {
                  item.onSelect();
                  setOpen(false);
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};
