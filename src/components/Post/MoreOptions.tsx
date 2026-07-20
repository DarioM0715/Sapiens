import { useEffect, useRef, useState } from "react";
import type { Option } from "@/types/system";
import { MoreVertical } from "lucide-react";
import ReactDOM from "react-dom";
import { ButtonAction } from "@/shared/ui/ButtonAction";

interface BottomSheetProps {
  options: Option[];
  onSelect?: (option: Option) => void;
  buttonLabel?: string;
  className?: string;
  initialOpen?: boolean;
}

export function MoreOptions({ options, onSelect, initialOpen = false }: BottomSheetProps) {
  const [open, setOpen] = useState<boolean>(initialOpen);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const firstOptionRef = useRef<HTMLButtonElement | null>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        firstOptionRef.current?.focus();
      }, 50);
    } else {
      triggerRef.current?.focus();
    }
  }, [open]);

  const openSheet = () => setOpen(true);
  const close = () => setOpen(false);

  const handleSelect = (option: Option) => {
    onSelect?.(option);
    close();
  };

  const handleOptionKey = (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
    const last = options.length - 1;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = idx === last ? 0 : idx + 1;
      optionRefs.current[next]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = idx === 0 ? last : idx - 1;
      optionRefs.current[prev]?.focus();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      optionRefs.current[idx]?.click();
    }
  };

  const portalRoot = (typeof document !== "undefined" && document.getElementById("modal-root")) || document.body;

  const sheet = (
    <>
      <div className={`fixed inset-0 bg-black/50 transition-opacity z-60 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`} aria-hidden={!open} onClick={close} />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Opciones"
        className={`fixed left-0 right-0 bottom-0 z-70 transform transition-transform ${open ? "translate-y-0" : "translate-y-full"} `}
      >
        <div className="max-w-3xl mx-auto">
          <div className="rounded-t-xl bg-surface shadow-lg overflow-hidden">
            {/* Handle */}
            <div className="flex justify-center py-2 bg-surface-2">
              <div className="w-12 h-1.5 bg-surface rounded-full" />
            </div>

            {/* Title */}
            <div className="px-4 pb-2 bg-surface-2  border-b border-[var(--color-border)]">
              <h3 className="text-sm font-medium text-primary dark:text-gray-100">Opciones</h3>
            </div>

            {/* Options list */}
            <div className="divide-y divide-[var(--color-border)]">
              {options.map((opt, idx) => (
                <button
                  key={opt.id}
                  ref={(el) => {
                    optionRefs.current[idx] = el;
                    if (idx === 0) firstOptionRef.current = el;
                  }}
                  onClick={() => handleSelect(opt)}
                  onKeyDown={(e) => handleOptionKey(e, idx)}
                  className="w-full text-left px-4 py-3 flex items-center gap-3 hover:cursor-pointer"
                >
                  {opt.Icon ? <opt.Icon className="w-5 h-5 " /> : null}
                  <div className="flex-1">
                    <div className="text-sm">{opt.label}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="px-4 py-3">
              <ButtonAction type="button" onClick={close} className="w-full text-center  px-4 py-2 rounded-lg font-medium">
                Cerrar
              </ButtonAction>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <button
        ref={triggerRef}
        onClick={openSheet}
        className="inline-flex items-center gap-2  rounded-md text-textprimary hover:cursor-pointer"
        aria-expanded={open}
        aria-controls="bottom-sheet"
      >
        <MoreVertical size={20} />
      </button>

      {typeof document !== "undefined" ? ReactDOM.createPortal(sheet, portalRoot) : sheet}
    </>
  );
}
