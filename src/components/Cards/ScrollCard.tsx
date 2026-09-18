import { PostCard } from "../Cards/PostCard";
import { useIsDesktop } from "@/shared/ui/useIsDesktop";
import { NavLink } from "react-router-dom";
import { AsidePost } from "../AsidePost";
import type { Path } from "@/types/components";
import type { Post } from "@/types/post";

interface Props {
  posts: Post[];
  navs: Path[];
  isLoading?: boolean;
  isEmpty?: boolean;
  chidren?: React.ReactNode;
}

export const ScrollCard = ({ posts, navs, isLoading = false, isEmpty = false }: Props) => {
  const isDesktop = useIsDesktop(1024);

  return (
    <div className="flex justify-center bg-surface lg:flex-row gap-8 w-full py-5 px-5 lg:px-10 xl:px-20">
      {/* MAIN COLUMN */}
      <section className="flex-1 flex flex-col rounded-2xl bg-surface-2 border-default">
        {isDesktop && (
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
        )}

        <div className="flex flex-col gap-4 bg-surface rounded-b-2xl overflow-hidden">
          {isLoading && <p className="py-10 text-center text-muted">Cargando publicaciones...</p>}
          {!isLoading && isEmpty && <p className="py-10 text-center text-muted">Aún no hay publicaciones.</p>}
          {!isLoading && !isEmpty && posts.map((post) => (
            <div key={post.id} className="border-b border-[var(--color-border)]">
              <PostCard post={post} />
            </div>
          ))}
        </div>
      </section>

      {isDesktop && (
        <aside className="w-80 lg:w-96 flex-shrink-0">
          <AsidePost />
        </aside>
      )}
    </div>
  );
};
