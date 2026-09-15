import { PostCard } from "../Cards/PostCard";
import { AsidePost } from "../AsidePost";
import { usePosts } from "@/hooks/useContent";

const NotificationsArticles = () => {
  const { data: posts = [], isLoading, isError } = usePosts();

  return (
    <div className="flex flex-col justify-center lg:flex-row gap-8 w-full py-5 px-5 lg:px-10 xl:px-20">
      <section className="flex-1 flex flex-col rounded-2xl bg-surface-2 border-default overflow-hidden">
        <nav className="sticky top-4 bg-surface-2 border-b border-[var(--color-border)] rounded-t-2xl z-40" aria-label="Navegación principal">
          <div className="px-4 md:px-6 lg:px-8">
            <div className="h-16 flex items-center">
              <h2 id="navcard-heading" className="font-semibold text-lg text-primary">
                Notificaciones
              </h2>
            </div>
          </div>
        </nav>

        <div className="flex flex-col gap-4 bg-surface p-4 md:p-6 rounded-b-2xl">
          {isLoading && <p className="py-10 text-center text-muted">Cargando publicaciones...</p>}
          {!isLoading && !isError && posts.length === 0 && <p className="py-10 text-center text-muted">Aún no hay publicaciones.</p>}
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      <aside className="w-80 lg:w-96 flex-shrink-0">
        <AsidePost />
      </aside>
    </div>
  );
};

export default NotificationsArticles;
