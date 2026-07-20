import { userlist } from "@/mock/mockusers";
import { Buttonav } from "@/shared/ui/Buttonnav";

// ICONS
import { Pencil, File, Plus } from "lucide-react";
import { Avatar } from "./Avatar";
import { NavLink } from "react-router-dom";

export const AsidePost = () => {
  const temas = [
    { id: 1, name: "Tema 1", description: "Contenido del tema 1" },
    { id: 2, name: "Tema 2", description: "Contenido del tema 2" },
    { id: 3, name: "Tema 3", description: "Contenido del tema 3" },
  ];

  return (
    <aside className="w-80 sticky -top-200 md:w-80 flex-shrink-0 px-2" aria-label="Barra lateral de publicaciones">
      <div className="max-h-[calc(100vh-5rem)]  flex flex-col gap-4">
        {/* PUBLICAR */}
        <div className="p-4 border-default rounded-xl flex flex-col gap-4 bg-surface-2 shadow-sm">
          <h2 className="text-lg font-semibold text-primary">Haz una publicación</h2>

          <div className="flex items-center gap-3">
            <Buttonav
              path="/publicar/texto"
              className="w-32 flex flex-col gap-2 items-center justify-center p-3 rounded-2xl bg-surface hover:bg-surface-1 border border-[var(--color-border)]"
              aria-label="Publicar texto"
            >
              <Pencil size={20} className="text-primary" />
              <p className="text-sm text-primary">Texto</p>
            </Buttonav>

            <Buttonav
              path="/publicar/documento"
              className="w-32 flex flex-col gap-2 items-center justify-center p-3 rounded-2xl bg-surface hover:bg-surface-1 border border-[var(--color-border)]"
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
            {userlist.map((user) => {
              const { id, name, username } = user;

              return (
                <div key={id} className="flex items-center justify-between w-full">
                  <NavLink to="/otroperfil/:4">
                    <div className="flex items-center gap-3">
                      <Avatar user={user} size={12} />
                      <div className="truncate">
                        <h3 className="font-semibold text-primary truncate">{name}</h3>
                        <p className="text-sm text-muted truncate">{username}</p>
                      </div>
                    </div>
                  </NavLink>

                  <button
                    aria-label={`Seguir a ${name}`}
                    className="p-2 border border-[var(--color-border)] rounded-xl transition flex items-center justify-center hover:cursor-pointer hover:bg-surface-2"
                    title={`Seguir a ${name}`}
                  >
                    <Plus size={18} className="text-primary" />
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
              <p className="font-medium">Nombre del contacto</p>
              <p className="text-muted">email@ejemplo.com</p>
            </div>

            <div>
              <p className="font-medium">Soporte</p>
              <p className="text-muted">soporte@ejemplo.com</p>
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
