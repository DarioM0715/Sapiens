import { NavLink } from "react-router-dom";

//INTERFACES
import type { Path } from "@/types/components";

type PanelOptionsProps = {
  title: string;
  buttons: Path[];
};

export const PanelOptions = ({ title, buttons }: PanelOptionsProps) => {
  return (
    <div className="text-primary animate-in fade-in duration-150 translate-y-2 absolute top-full mt-2 right-0 w-60 bg-surface text-black shadow-lg p-2 z-50 pointer-events-auto border border-gray-300 rounded-lg">
      <div className="text-sm font-semibold px-2 pb-2 bg-surface-2 rounded-t-sm border-b border-[var(--color-border)]">{title}</div>

      <div className="flex gap-0.5 flex-col">
        {buttons.map((button) =>
          button.onClick ? (
            <button
              key={button.name ?? button.path}
              type="button"
              onClick={button.onClick}
              className="flex items-center gap-5 w-full text-left px-2 py-1 hover-surface-2 cursor-pointer"
            >
              {button.icon && <button.icon className="text-primary" />}
              {button.name}
            </button>
          ) : (
            <NavLink
              key={button.name ?? button.path}
              to={button.path}
              className="flex items-center gap-5 w-full text-left px-2 py-1 hover-surface-2"
            >
              {button.icon && <button.icon className="text-primary" />}
              {button.name}
            </NavLink>
          )
        )}
      </div>
    </div>
  );
};
