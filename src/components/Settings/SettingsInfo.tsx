import { Buttonav } from "@/shared/ui/Buttonnav";
import { ChevronRight } from "lucide-react";

export const SettingsCard = () => {
  const infoOptions = [
    { name: "Información de la cuenta", path: "/settings/cuenta" },
    { name: "Gestión de notificaciones", path: "/settings/notificaciones" },
    { name: "settings de privacidad", path: "/settings/privacidad" },
    { name: "Gestión de bloqueos", path: "/settings/bloqueados" },
    { name: "settings del sistema", path: "/settings/sistema" },
    { name: "Cerrar sesión", path: "/" },
  ];

  return (
    <div className="bg-surface-2 border-default rounded-2xl shadow-sm p-4">
      <h2 className="font-semibold text-lg text-primary pb-3 border-b border-[var(--color-border)]">Gestión de información</h2>
      <div className="flex flex-col">
        {infoOptions.map((option, key) => (
          <Buttonav path={option.path} key={key} className="flex items-center justify-between p-4 hover:bg-surface transition rounded-md text-primary">
            <p>{option.name}</p>
            <div className="flex items-center gap-2">
              <ChevronRight size={24} />
            </div>
          </Buttonav>
        ))}
      </div>
    </div>
  );
};

export default SettingsCard;
