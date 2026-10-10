import { NavCard } from "../NavCard";

export const SettingsCard = () => {
  const infoOptions = [
    { name: "Información de la cuenta", path: "/settings/cuenta" },
    { name: "Gestión de notificaciones", path: "/settings/notificaciones" },
    { name: "settings de privacidad", path: "/settings/privacidad" },
    { name: "Gestión de bloqueos", path: "/settings/bloqueados" },
    { name: "settings del sistema", path: "/settings/sistema" },
    { name: "Cerrar sesión", path: "/" },
  ];

  return <NavCard title="Gestion de información" listlink={infoOptions} />;
};
