//COMPONENTS
import { Buttonav } from "@/shared/ui/Buttonnav";

// ICONS
import { Pencil, File, Plus, Check } from "lucide-react";
import { Avatar } from "./Avatar";
import { NavLink } from "react-router-dom";

//HOOKS
import { useUsers } from "@/hooks/useUsers";
import { useFollowUser, useUnfollowUser } from "@/hooks/useFollows";
import { useAuthContext } from "@/context/AuthContext";

export const AsidePost = () => {
  const temas = [
    { id: 1, name: "Tema 1", description: "Contenido del tema 1" },
    { id: 2, name: "Tema 2", description: "Contenido del tema 2" },
    { id: 3, name: "Tema 3", description: "Contenido del tema 3" },
  ];

  const { user: currentUser } = useAuthContext();
  const { data: users = [], isLoading } = useUsers();
  const followMutation = useFollowUser();
  const unfollowMutation = useUnfollowUser();

  const recommendedUsers = users.filter((user) => String(user.id) !== String(currentUser?.id));
  const isFollowPending = followMutation.isPending || unfollowMutation.isPending;

  return (
    <aside className="w-80 sticky -top-200 md:w-80 flex-shrink-0 px-2" aria-label="Barra lateral de publicaciones">
      <div className="flex flex-col gap-4">
        {/* PUBLICAR */}
        <div className="p-4 border-default rounded-xl flex flex-col gap-4 bg-surface-2 shadow-sm">
          <h2 className="text-lg font-semibold text-primary">Haz una publicación</h2>

          <div className="flex items-center gap-3">
            <Buttonav
              path="/create/article"
              className="w-32 flex flex-col gap-2 items-center justify-center p-3 rounded-2xl bg-surface hover-surface-2 border border-[var(--color-border)]"
              aria-label="Publicar texto"
            >
              <Pencil size={20} className="text-primary" />
              <p className="text-sm text-primary">Texto</p>
            </Buttonav>

            <Buttonav
              path="/create/document"
              className="w-32 flex flex-col gap-2 items-center justify-center p-3 rounded-2xl bg-surface hover-surface-2 border border-[var(--color-border)]"
              aria-label="Publicar imagen"
            >
              <File size={20} className="text-primary" />
              <p className="text-sm text-primary">Documento</p>
            </Buttonav>
          </div>
        </div>

        {/* USUARIOS RECOMENDADOS */}
        <div className="p-4 border-default rounded-xl flex flex-col gap-3 bg-surface-2 shadow-sm">
          <h2 className="text-lg font-semibold text-primary">Usuarios recomendados</h2>

          <div className="flex flex-col gap-3">
            {isLoading && <p className="text-sm text-muted">Cargando usuarios...</p>}
            {!isLoading && recommendedUsers.length === 0 && (
              <p className="text-sm text-muted">No hay usuarios para recomendar.</p>
            )}

            {recommendedUsers.map((user) => {
              const { id, name, username, isFollowing } = user;

              return (
                <div key={id} className="flex items-center justify-between w-full">
                  <NavLink to={`/user/${id}`}>
                    <div className="flex items-center gap-3">
                      <Avatar user={user} size={12} />
                      <div className="truncate">
                        <h3 className="font-semibold text-primary truncate">{name}</h3>
                        <p className="text-sm text-muted truncate">{username}</p>
                      </div>
                    </div>
                  </NavLink>

                  <button
                    type="button"
                    onClick={() => (isFollowing ? unfollowMutation.mutate(id) : followMutation.mutate(id))}
                    disabled={isFollowPending}
                    aria-label={isFollowing ? `Dejar de seguir a ${name}` : `Seguir a ${name}`}
                    className="p-2 border border-[var(--color-border)] rounded-xl transition flex items-center justify-center hover:cursor-pointer bg-surface hover-surface-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    title={isFollowing ? `Dejar de seguir a ${name}` : `Seguir a ${name}`}
                  >
                    {isFollowing ? <Check size={18} className="text-primary" /> : <Plus size={18} className="text-primary" />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* TEMAS POPULARES */}
        <div className="p-4 border-default rounded-xl flex flex-col gap-3 bg-surface-2 shadow-sm">
          <h2 className="text-lg font-semibold text-primary">Temas populares</h2>

          <div className="flex flex-col gap-3">
            {temas.map((t) => (
              <article key={t.id} className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold text-primary">#{t.name}</h3>
                <p className="text-sm text-muted">{t.description}</p>
              </article>
            ))}
          </div>
        </div>

        {/* CONTACTO Y INFO */}
        <section className="rounded-xl flex flex-col gap-3">
          <h2 className="font-semibold text-lg text-primary">Contacto</h2>

          <div className="flex flex-col gap-2 text-sm text-primary">
            <div>
              <p className="font-medium">Soporte:</p>
              <p className="text-muted">dariomartinezotano@gmail.com</p>
            </div>
          </div>

          <div className="pt-2 text-sm text-muted">
            <p>Política de privacidad de Sapiens</p>
            <p className="mt-2">Copyright © SAPIENS. All Rights Reserved.</p>
          </div>
        </section>
      </div>
    </aside>
  );
};
