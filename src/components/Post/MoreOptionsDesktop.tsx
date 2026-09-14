import { useEffect, useRef, useState } from "react";
import type { Option } from "@/types/system";
import { MoreVertical } from "lucide-react";
import { ButtonAction } from "@/shared/ui/ButtonAction";

interface BottomSheetProps {
  options: Option[];
  onSelect?: (option: Option) => void;
  buttonLabel?: string;
  className?: string;
  initialOpen?: boolean;
}

interface SheetProps {
  open: boolean;
  options: Option[];
  handleClose: () => void;
}

export const Sheet = ({open, options, handleClose} : SheetProps) => {
  return (
    <>
      <div className={`fixed inset-0 bg-black/50 transition-opacity z-60 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`} 
        onClick={handleClose} />

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
              <h3 className="text-sm font-medium text-primary">Opciones</h3>
            </div>

            {/* Options list */}
            <div className="divide-y divide-[var(--color-border)] text-primary">
              {options.map((opt) => (
                <button
                  key={opt.id}
                  // onClick={() => handleSelect(opt)}
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
              <ButtonAction type="button" onClick={handleClose} className="w-full text-center px-4 py-2 rounded-lg font-medium">
                Cerrar
              </ButtonAction>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export function MoreOptionsDesktop({ options, onSelect, initialOpen = false }: BottomSheetProps) {
  const [open, setOpen] = useState<boolean>(initialOpen);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSelect = (option: Option) => {
    onSelect?.(option);
    handleClose();
  };


  return (
    <>
      <button
        ref={triggerRef}
        onClick={handleOpen}
        className="inline-flex items-center gap-2 rounded-md text-textprimary hover:cursor-pointer relative"
        aria-expanded={open}
        aria-controls="bottom-sheet"
      >
        <MoreVertical size={20} />
      </button>

      {open && <Sheet options={options} open handleClose={handleClose}/>}
    </>
  );
}
