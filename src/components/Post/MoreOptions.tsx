import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import type { Path } from "@/types/components";

type MoreOptionsProps = {
  buttons: Path[];
};

export const MoreOptions = ({buttons}: MoreOptionsProps) => {
    const rightActionsRef = useRef<HTMLDivElement | null>(null);
    const [openPanel, setOpenPanel] = useState<string | null>(null);

    const handleMouseEnter = (panel: string) => {
        setOpenPanel(panel);
    };

    const handleMouseLeave = () => {
        setOpenPanel(null);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (rightActionsRef.current && !rightActionsRef.current.contains(event.target as Node)) {
            handleMouseLeave();
          }
        };
    
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, []);

    return (
        <div className="text-primary animate-in fade-in duration-150 translate-y-2 absolute top-full mt-2 right-0 w-60 bg-surface text-black shadow-lg p-2 z-50 pointer-events-auto border border-gray-300 rounded-lg">
            <div className="flex gap-0.5 flex-col">
              {buttons.map((button) => (
                <NavLink to={button.path} className="flex items-center gap-5 w-full text-left px-2 py-1 hover-surface-2">
                  {button.icon && <button.icon className="text-primary" />}
                  {button.name}
                </NavLink>
              ))}
            </div>
        </div>
    )
}

 