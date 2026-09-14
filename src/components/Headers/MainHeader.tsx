import { NavLink } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import { useRef, useState, useEffect } from "react";

// ICONS
import { Bell, PencilLine } from "lucide-react";

//COMPONENTS
import { PanelOptions } from "./PanelOptions";
import { Avatar } from "../Avatar";

//SHAREDS
import { Input } from "@/shared/inputs/Input";

export const Bubble = ({ number }: { number: number }) => {
  return (
    <div className="bg-red-600 border-4 border-gray-900 absolute rounded-full px-2 bottom-4 left-5">
      <span className="font-bold">
        {number}
      </span>
    </div>
  )
}

export const MainHeader = () => {
  const { user } = useAuthContext();
  const id = user?.id ?? "";

  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const rightActionsRef = useRef<HTMLDivElement | null>(null);

  const navsup = [
    { name: "Sapiens", path: "/" },
    { name: "Inicio", path: "/home" },
    { name: "Comunidades", path: "/community" },
  ];

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

  const buttonsPost = [
    { name: "Texto", path: "/create/article" },
    { name: "Documento", path: "/create/document" },
  ];

  const buttonsNotifications = [{ name: "Notificaciones", path: "/notificaciones" }];

  const buttonsProfile = [
    { name: "Ver perfil", path:`/user/${id}` },
    { name: "Ajustes", path: "/settings" },
    { name: "Cerrar sesión", path: "/login" },
  ];

  return (
    <header className="bg-surface sticky top-0 left-0 right-0 text-primary z-50 border-b border-[var(--color-border)]">
      <nav className="py-4 px-6 md:px-10">
        <div className="flex items-center justify-between gap-6">
          {/* Left - Nav links */}
          <div className="flex items-center gap-6">
            <ul className="flex items-center gap-6">
              {navsup.map((nav) => (
                <li key={nav.name} className="font-semibold">
                  <NavLink
                    to={nav.path}
                    className={({ isActive }) =>
                      `text-base inline-flex items-center px-2 py-1 rounded-md transition ${isActive ? "text-primary" : "text-muted hover:text-primary"}`
                    }
                  >
                    {nav.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Center - Search */}
          <div className="flex-1 flex justify-center px-4">
            <Input type="search" placeholder="Buscar contenido..." className="w-full max-w-xl px-4 py-2 rounded-xl bg-surface-2 border border-[var(--color-border)] text-primary" />
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-6" ref={rightActionsRef}>
            {/* Crear documento */}
            <div className="relative inline-block" onMouseEnter={() => handleMouseEnter("post")}>
              <button aria-label="Crear documento" aria-haspopup="true" type="button" className="p-3 cursor-pointer hover-surface-2 transition rounded-full">
                <PencilLine size={20} className="text-primary" />
              </button>
              {openPanel === "post" && <PanelOptions title="Escritura" buttons={buttonsPost} />}
            </div>

            {/* Notificaciones */}
            <div className="relative inline-block" onMouseEnter={() => handleMouseEnter("notifications")}>
              <button aria-label="Notificaciones" aria-haspopup="true" type="button" className="p-3 cursor-pointer hover-surface-2 transition rounded-full">
                <Bell size={20} className="text-primary" />
              </button>
              {openPanel === "notifications" && <PanelOptions title="Notificaciones" buttons={buttonsNotifications} />}
              <Bubble number={5}/>
            </div>

            {/* user */}
            <div className="relative inline-block" onMouseEnter={() => handleMouseEnter("profile")}>
              <NavLink to="/user" className="block rounded-full focus:outline-none focus-ring-primary" aria-haspopup="true">
                <Avatar user={user} size={10} />
              </NavLink>
              {openPanel === "profile" && <PanelOptions title="Usuario" buttons={buttonsProfile} />}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default MainHeader;
