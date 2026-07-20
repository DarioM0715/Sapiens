import { useMemo, useState } from "react";
import { Bell, type LucideIcon, LockIcon } from "lucide-react";

type SettingsNav = {
  name: string;
  path: string;
  icon: LucideIcon;
};

const Settings = () => {
  const settingsnavs: SettingsNav[] = [
    { name: "Notificaciones", path: "/notificaciones", icon: Bell },
    { name: "Privacidad", path: "/ajustes/privacidad", icon: LockIcon },
    { name: "Sistema", path: "/ajustes/sistema", icon: LockIcon },
  ];

  const notificacionessettings = [
    { name: "Alguien comento o te respondio", relation: "You" },
    { name: "Alguien te dio me gusta", relation: "You" },
    { name: "Alguien comenzo a seguirte", relation: "You" },
    { name: "Menciones", relation: "You" },
    { name: "Sistema", relation: "Sistem" },
    { name: "Eventos", relation: "Sistem" },
  ];

  const privacidadsettings = [
    { name: "Mostrar las publicaciones que he publicado en mi página personal" },
    { name: "Mostrar los comentarios que he publicado en mi página personal" },
    { name: "Mostrar la lista de usuarios que sigo en mi perfil" },
    { name: "Mostrar los usuarios que me siguen en mi perfil" },
    { name: "Se pueden hacer comentarios en mis publicaciones y comentarios" },
    { name: "Pueden compartirse mis publicaciones" },
    { name: "Pueden guardarse mis publicaciones" },
    { name: "Puedo ser mencionado con (@)" },
  ];

  const sistemasettings = [{ name: "Ajustes de apariencia" }];

  const [selectedNav, setSelectedNav] = useState<string>("Informacion");

  const initialNotificationsState = useMemo(() => {
    const state: Record<string, boolean> = {};
    notificacionessettings.forEach((n) => (state[n.name] = true));
    return state;
  }, []);

  const [notificationsState, setNotificationsState] = useState<Record<string, boolean>>(initialNotificationsState);

  function toggleNotification(name: string) {
    setNotificationsState((prev) => ({ ...prev, [name]: !prev[name] }));
  }

  const renderPanel = () => {
    switch (selectedNav) {
      case "Notificaciones":
        return (
          <div className="p-4">
            <div className="space-y-5">
              {notificacionessettings.map((n) => (
                <div key={n.name} className="flex items-center justify-between rounded-md">
                  <div>{n.name}</div>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!notificationsState[n.name]}
                      onChange={() => toggleNotification(n.name)}
                      className="h-4 w-4"
                      aria-checked={!!notificationsState[n.name]}
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>
        );

      case "Privacidad":
        return (
          <div className="p-4">
            <div className="space-y-5">
              {privacidadsettings.map((p) => (
                <div key={p.name} className="flex items-center justify-between rounded-md ">
                  <div className="truncate">{p.name}</div>
                  <input type="checkbox" className="h-4 w-4 " defaultChecked />
                </div>
              ))}
            </div>
          </div>
        );

      case "Sistema":
        return (
          <div className="p-4">
            <ul className="space-y-5">
              {sistemasettings.map((s) => (
                <li key={s.name} className="rounded-md">
                  {s.name}
                </li>
              ))}
            </ul>
          </div>
        );

      default:
        return <div className="p-4">Seleccione una sección</div>;
    }
  };

  return (
    <div className="flex justify-center gap-8 w-full py-5 px-5 lg:px-10 xl:px-20">
      <div className="w-80">
        <div className="bg-surface-2 border-default rounded-2xl shadow-sm">
          <nav className="flex flex-col divide-y divide-[var(--color-border)] rounded-md">
            {settingsnavs.map(({ name, icon: Icon }) => {
              const active = name === selectedNav;
              return (
                <button
                  key={name}
                  className={`w-full p-5 flex items-center text-primary transition justify-start cursor-pointer ${active ? "bg-surface/50" : "hover:bg-surface"}`}
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    setSelectedNav(name);
                  }}
                  aria-pressed={active}
                >
                  <div className={`flex gap-5 items-center ${active ? "text-gray-500" : "text-primary"}`}>
                    <Icon size={20} />
                    <span className="text-lg font-medium truncate">{name}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Panel derecho */}
      <div className="flex-1 max-w-[640px]">
        <div className="bg-surface-2 border-default rounded-2xl shadow-sm">
          <div className="bg-surface-2 border-b border-[var(--color-border)] rounded-t-2xl px-4">
            <div className="h-16 flex items-center justify-between">
              <h2 id="navcard-heading" className="font-semibold text-lg text-primary">
                {selectedNav}
              </h2>
            </div>
          </div>

          <nav className="flex flex-col bg-surface rounded-b-2xl">{renderPanel()}</nav>
        </div>
      </div>
    </div>
  );
};

export default Settings;
