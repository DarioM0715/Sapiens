import { NavLink } from "react-router-dom";
import { Home, Satellite, CirclePlus, User, Bell } from "lucide-react";

export const Footer = () => {
  const navsbottom = [
    { name: "Inicio", path: "/inicio", Icon: Home },
    { name: "Buscar", path: "/buscar", Icon: Satellite },
    { name: "Publicar", path: "/publicar", Icon: CirclePlus },
    { name: "Notificaciones", path: "/notificaciones", Icon: Bell },
    { name: "user", path: "/user", Icon: User },
  ];

  return (
    <footer className="bg-primary flex-none text-textprimary p-4 sticky bottom-0 left-0 right-0 z-40">
      <ul className="flex items-center justify-between">
        {navsbottom.map((nav) => (
          <li key={nav.name}>
            <NavLink to={nav.path} className={({ isActive }) => `flex flex-col items-center text-xs ${isActive ? "text-blue-500" : "text-textprimary"}`}>
              <nav.Icon size={24} />
            </NavLink>
          </li>
        ))}
      </ul>
    </footer>
  );
};
