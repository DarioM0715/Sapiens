import { NavLink } from "react-router-dom";

export const MobileHeader = () => {
  const navsup = [
    { name: "Inicio", path: "/home" },
    { name: "Siguiendo", path: "/home/following" },
    // { name: "Comunidades", path: "/community" },
  ];

  return (
    <header className="bg-surface flex-none sticky top-0 left-0 right-0 text-primary z-40 border-b border-gray-600">
      <nav className="py-4 px-4 gap-4">
        <div className="flex flex-col gap-2">
          <ul className="flex items-center gap-5">
            {navsup.map((nav) => (
              <li key={nav.name} className="font-bold">
                <NavLink to={nav.path} className="text-lg inline-flex items-center">
                  {nav.name}
                </NavLink>
              </li>
            ))}
          </ul>

          <input type="text" placeholder="Buscar contenido de interes" className="bg-secundary border border-gray-500 rounded-xl py-1 px-5 w-full" />
        </div>
      </nav>
    </header>
  );
};
