import { NavLink } from "react-router-dom";
import { UserCard } from "./UserCard";
import type { User } from "@/types/users";

type FollowListProps = {
    users: User[];
    isLoading: boolean;
    navs: {
        name: string
        path: string
    }[]
    isOwn: boolean
    messages: string[]
}

const FollowList = ({users, isLoading, navs, isOwn}: FollowListProps) => {

  return (
    <div className="flex flex-col justify-center lg:flex-row gap-8 w-full py-5 px-5 lg:px-20 xl:px-32">
      {/* MAIN COLUMN */}
      <section className="flex-1 flex flex-col rounded-2xl bg-surface-2 border-default">
        <nav className="sticky top-18 bg-surface-2 border-b border-[var(--color-border)] rounded-t-2xl z-40" aria-label="Navegación principal">
          <div className="px-4 md:px-6 lg:px-8">
            <ul className="flex items-center gap-6 h-16">
              {navs.map((nav) => (
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
        </nav>
        <div className="flex flex-col gap-4 bg-surface rounded-b-2xl overflow-hidden">
          {isLoading && <p className="py-10 text-center text-muted">Cargando usuarios...</p>}
          {!isLoading && users.length === 0 && (
            <p className="py-10 text-center text-muted">
              {isOwn ? "No tienes seguidores." : "Este usuario no tiene seguidores."}
            </p>
          )}
          {!isLoading && users.map((user, number) => <UserCard key={user.id} user={user} finaluser={users.length - 1} number={number}/>)}
        </div>
      </section>
    </div>
  );
};

export default FollowList;
