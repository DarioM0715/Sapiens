import { NavLink } from "react-router-dom";
import { Home, Satellite, CirclePlus, User, Bell } from "lucide-react";

export const Bubble = ({ number }: { number: number }) => {
  return (
    <div className="bg-red-600 border-4 border-gray-900 absolute rounded-full px-2 bottom-3 left-3">
      {number}
    </div>
  )
}

export const Footer = () => {
  const navsbottom = [
    { name: "Inicio", path: "/home", Icon: Home },
    { name: "Buscar", path: "/buscar", Icon: Satellite },
    { name: "Publicar", path: "/publicar", Icon: CirclePlus },
    { name: "Notificaciones", path: "/notificaciones", Icon: Bell },
    { name: "user", path: "/user", Icon: User },
  ];

  return (
    <footer className="bg-surface flex-none text-primary p-4 sticky bottom-0 left-0 right-0 z-40 border-t border-[var(--color-border)]">
      <ul className="flex items-center justify-between">
        {navsbottom.map((nav) => (
          <li key={nav.name} className="relative">
            <NavLink to={nav.path} className={({ isActive }) => `flex flex-col items-center text-xs ${isActive ? "text-blue-500" : "text-textprimary"}`}>
              <nav.Icon size={24} />
            </NavLink>
            {nav.name === "Notificaciones" && <Bubble number={5}/>}
          </li>
        ))}
      </ul>
    </footer>
  );
};
