import type { LucideIcon } from "lucide-react";

export type Path = {
  name?: string;
  path: string;
  icon?: React.ComponentType<{ className?: string }> | LucideIcon;
  onClick?: () => void;
};
