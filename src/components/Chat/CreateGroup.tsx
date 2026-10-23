import React, { useState } from "react";
import { UserIcon } from "lucide-react";

type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

const CreateGroup: React.FC = () => {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [participants, setParticipants] = useState<User[]>([]);
  const [newUser, setNewUser] = useState("");

  const handleAddUser = () => {
    const trimmed = newUser.trim();
    if (!trimmed) return;
    const user: User = {
      id: Math.random().toString(36).slice(2, 9),
      name: trimmed,
      email: `${trimmed.toLowerCase().replace(/\s+/g, ".")}@ejemplo.com`,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(trimmed)}&background=random`,
    };
    setParticipants((p) => [...p, user]);
    setNewUser("");
  };

  const handleRemoveUser = (id: string) => {
    setParticipants((p) => p.filter((u) => u.id !== id));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) {
      alert("El nombre del grupo es obligatorio.");
      return;
    }
    const groupData = { groupName, description, avatar, participants };
    console.log("Grupo creado:", groupData);
    alert(`Grupo "${groupName}" creado con ${participants.length} participante(s)!`);
  };

  return (
    <div className="mx-auto w-full max-w-3xl p-6 bg-surface rounded-2xl border-default shadow-sm">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-primary">Crear nuevo grupo</h1>
        <p className="text-sm text-muted mt-1">Configura el nombre, la imagen y añade participantes.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Foto del grupo */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden border-[var(--color-border)] border-2 bg-surface flex items-center justify-center">
                {avatar ? <img src={avatar} alt="Foto del grupo" className="w-full h-full object-cover" /> : <UserIcon size={36} className="text-muted" />}
              </div>

              <label
                htmlFor="group-avatar"
                className="absolute -right-2 -bottom-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 border border-[var(--color-border)] text-sm text-primary shadow-sm cursor-pointer hover:bg-surface"
                title="Cambiar foto del grupo"
              >
                Cambiar
                <input id="group-avatar" type="file" accept="image/*" onChange={handleAvatarChange} className="sr-only" />
              </label>
            </div>

            <div>
              <label htmlFor="groupName" className="block text-sm font-medium text-primary">
                Nombre del grupo
              </label>
              <input
                id="groupName"
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Ej. Equipo de trabajo"
                className="mt-1 w-full p-3 rounded-md bg-surface-2 border border-[var(--color-border)] text-primary placeholder:text-muted focus:outline-none focus-ring-primary"
                required
              />
            </div>
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-primary">
            Descripción (opcional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full p-3 rounded-md bg-surface-2 border border-[var(--color-border)] text-primary placeholder:text-muted focus:outline-none focus-ring-primary resize-vertical"
            placeholder="Breve descripción del grupo..."
          />
        </div>

        {/* Participantes */}
        <div>
          <label className="block text-sm font-medium text-primary mb-2">Participantes</label>

          <div className="flex items-center gap-3 mb-3">
            <input
              type="text"
              value={newUser}
              onChange={(e) => setNewUser(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddUser())}
              className="flex-1 p-3 rounded-md bg-surface-2 border border-[var(--color-border)] text-primary placeholder:text-muted focus:outline-none focus-ring-primary"
              placeholder="Escribe un nombre y presiona Enter"
              aria-label="Añadir participante"
            />
            <button
              type="button"
              onClick={handleAddUser}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md btn-primary"
              aria-label="Agregar participante"
            >
              Agregar
            </button>
          </div>

          {participants.length === 0 ? (
            <p className="text-sm text-muted">No hay participantes aún.</p>
          ) : (
            <ul className="space-y-2">
              {participants.map((u) => (
                <li key={u.id} className="flex items-center justify-between border border-[var(--color-border)] rounded-md p-2 bg-surface">
                  <div className="flex items-center gap-3">
                    <img src={u.avatar} alt={`${u.name} avatar`} className="w-9 h-9 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-medium text-primary">{u.name}</p>
                      <p className="text-xs text-muted">{u.email}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveUser(u.id)}
                    className="text-sm text-danger hover:underline"
                    aria-label={`Eliminar ${u.name}`}
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => {
              setGroupName("");
              setDescription("");
              setAvatar(null);
              setParticipants([]);
              setNewUser("");
            }}
            className="px-4 py-2 rounded-md border border-[var(--color-border)] bg-surface text-primary hover-surface-2 transition"
            aria-label="Descartar cambios"
          >
            Descartar
          </button>

          <button type="submit" className="inline-flex items-center gap-2 px-5 py-2 rounded-md btn-primary" aria-label="Crear grupo">
            Crear grupo
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateGroup;
