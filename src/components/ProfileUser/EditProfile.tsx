import React from "react";
import { useAuthContext } from "@/context/AuthContext";
import { Camera, Upload } from "lucide-react";

const EditProfile: React.FC = () => {
  const { user } = useAuthContext();
  const avatar = user?.avatar ?? "/images/avatar-placeholder.png";

  return (
    <main className="flex-1 flex items-start justify-center py-8 px-4 sm:px-6 lg:px-12 bg-surface text-primary">
      <section className="w-full max-w-3xl">
        <div className="bg-surface-2 border-default rounded-2xl shadow-md p-6 sm:p-8 flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={avatar}
                alt={`${user?.name ?? "Usuario"} avatar`}
                className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-2 border-[var(--color-surface)] shadow-lg"
                loading="lazy"
              />

              {/* Visual file input (no handler) */}
              <label
                htmlFor="avatar-upload"
                className="absolute right-0 bottom-0 transform translate-x-2 translate-y-2 bg-white border border-[var(--color-border)] rounded-full p-2 shadow-sm cursor-pointer hover-surface-2"
                title="Cambiar avatar"
              >
                <Camera size={18} className="text-primary" />
                <input id="avatar-upload" type="file" accept="image/*" className="sr-only" aria-hidden />
              </label>
            </div>

            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-primary">{user?.name ?? "Nombre de usuario"}</h1>
              <p className="text-sm text-muted mt-1">{user?.email ?? "email@ejemplo.com"}</p>
            </div>
          </div>

          {/* Form body */}
          <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="username" className="text-sm font-medium text-primary">
                  Nombre de usuario
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder={user?.name ?? "Nombre de usuario"}
                  className="w-full p-3 rounded-md bg-surface border border-[var(--color-border)] text-primary placeholder:text-muted focus:outline-none focus-ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="alias" className="text-sm font-medium text-primary">
                  Alias
                </label>
                <input
                  id="alias"
                  type="text"
                  placeholder="Alias"
                  className="w-full p-3 rounded-md bg-surface border border-[var(--color-border)] text-primary placeholder:text-muted focus:outline-none focus-ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="dob" className="text-sm font-medium text-primary">
                  Fecha de nacimiento
                </label>
                <input
                  id="dob"
                  type="date"
                  placeholder="dd/mm/aaaa"
                  className="w-full p-3 rounded-md bg-surface border border-[var(--color-border)] text-primary placeholder:text-muted focus:outline-none focus-ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="gender" className="text-sm font-medium text-primary">
                  Sexo
                </label>
                <select
                  id="gender"
                  className="w-full p-3 rounded-md bg-surface border border-[var(--color-border)] text-primary placeholder:text-muted focus:outline-none focus-ring-primary"
                >
                  <option value="male">Masculino</option>
                  <option value="female">Femenino</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="about" className="text-sm font-medium text-primary">
                Sobre ti
              </label>
              <textarea
                id="about"
                rows={4}
                placeholder="Cuenta algo sobre ti..."
                className="w-full p-3 rounded-md bg-surface border border-[var(--color-border)] text-primary placeholder:text-muted focus:outline-none focus-ring-primary resize-vertical"
              />
              <p className="text-xs text-muted mt-1">Máx. 300 caracteres (solo UI).</p>
            </div>

            <div className="flex items-center justify-end gap-4 pt-2">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Cancelar"
                  className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-primary bg-surface hover-surface-2"
                >
                  Cancelar
                </button>

                <button type="submit" aria-label="Guardar cambios" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg btn-primary">
                  Guardar
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};

export default EditProfile;
