import { useState } from "react";
import image from "@/assets/images/20260328_032700.jpg"

const GroupSettings = () => {
  const participants = [
    {
      id: "1",
      name: "Carlos Pérez",
      email: "carlos@ejemplo.com",
      avatar: image,
      role: "administrador",
    },
    {
      id: "2",
      name: "María López",
      email: "maria@ejemplo.com",
      avatar: image,
      role: "miembro",
    },
    {
      id: "3",
      name: "Juan Torres",
      email: "juan@ejemplo.com",
      avatar: image,
      role: "miembro",
    },
  ];

  const [users, setUsers] = useState<any[]>(participants);

  const toggleAdmin = (id: string) => {
    const updated = users.map((u) => (u.id === id ? { ...u, role: u.role === "administrador" ? "miembro" : "administrador" } : u));
    setUsers(updated);
    // onUpdate(updated);
  };

  const handleRemove = (id: string) => {
    const updated = users.filter((u) => u.id !== id);
    setUsers(updated);
    // onUpdate(updated);
  };

  return (
    <div className="bg-surface p-4 rounded-2xl border border-default shadow-sm w-full max-w-2xl mx-auto">
      <h2 className="text-lg font-semibold text-primary mb-4">Administrar miembros</h2>

      {users.length === 0 ? (
        <p className="text-muted text-sm">No hay miembros en el grupo.</p>
      ) : (
        <ul className="space-y-2">
          {users.map((u) => (
            <li key={u.id} className="flex items-center justify-between border border-[var(--color-border)] rounded-md p-2 bg-surface-2">
              <div className="flex items-center gap-3">
                <img
                  src={u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=random`}
                  alt={u.name}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-primary">{u.name}</p>
                  <p className="text-xs text-muted">{u.email}</p>
                  <p className="text-xs font-medium text-indigo-600 mt-0.5">{u.role === "administrador" ? "Administrador" : "Miembro"}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => toggleAdmin(u.id)}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    u.role === "administrador" ? "bg-gray-200 text-primary hover:bg-gray-300" : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {u.role === "administrador" ? "Quitar administración" : "Otorg. administración"}
                </button>

                <button type="button" onClick={() => handleRemove(u.id)} className="px-3 py-1 rounded-md text-sm font-medium text-red-600 hover:bg-red-100">
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GroupSettings;
