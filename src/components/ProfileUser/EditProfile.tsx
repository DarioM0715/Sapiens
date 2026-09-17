import { useRef, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import type { User } from "@/types/users";
import { Camera, Upload, Save, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EditProfile: React.FC = () => {
  const { user, updateUser } = useAuthContext();
  const [name, setName] = useState(user?.name ?? "");
  const [alias, setAlias] = useState(user?.username ?? "");
  const [sex, setSex] = useState(user?.sex ?? "masculino");
  const [note, setNote] = useState(user?.note ?? "");
  const [avatar, setAvatar] = useState(user?.avatar ?? "");
  const [background, setBackground] = useState(user?.background ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  const avatarPreview = avatar || "/images/avatar-placeholder.png";
  const backgroundPreview = background;
  const id = user?.id ?? "";

  const navigate = useNavigate();

  const readFileAsDataURL = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      if (!file.type.startsWith("image/")) {
        reject(new Error("El archivo debe ser una imagen"));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("No se pudo leer el archivo"));
      reader.readAsDataURL(file);
    });
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataURL(file);
      setAvatar(dataUrl);
      event.target.value = "";
    } catch (error: unknown) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "No se pudo leer la imagen" });
    }
  };

  const handleBackgroundChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataURL(file);
      setBackground(dataUrl);
      event.target.value = "";
    } catch (error: unknown) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "No se pudo leer la imagen" });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setSaving(true);
    try {
      await updateUser({ name, username: alias, sex, note, avatar, background });
      navigate(`/user/${id}`);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setMessage({ type: "error", text: err?.response?.data?.message || "Error al guardar los cambios" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="flex-1 flex items-start justify-center py-8 px-4 sm:px-6 lg:px-12 bg-surface text-primary">
      <section className="w-full max-w-3xl">
        <div className="bg-surface-2 border-default rounded-2xl shadow-md p-6 sm:p-8 flex flex-col gap-6">
          {/* Portada */}
          <div className="relative">
            {backgroundPreview ? (
              <img src={backgroundPreview} alt="Portada" className="w-full h-32 md:h-40 object-cover rounded-xl" />
            ) : (
              <div className="w-full h-32 md:h-40 rounded-xl bg-surface border border-[var(--color-border)] flex items-center justify-center text-muted text-sm">
                Sin portada
              </div>
            )}
            <button
              type="button"
              onClick={() => backgroundInputRef.current?.click()}
              className="absolute right-3 bottom-3 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-surface text-sm font-medium text-primary shadow hover-surface-2 cursor-pointer"
              title="Cambiar portada"
            >
              <Upload size={16} />
              Portada
            </button>
            <input
              ref={backgroundInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleBackgroundChange}
            />
          </div>

          {/* Header avatar */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={avatarPreview}
                alt={`${name || "Usuario"} avatar`}
                className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-2 border-[var(--color-surface)] shadow-lg"
              />
              <label
                htmlFor="avatar-upload"
                className="absolute right-0 bottom-0 transform translate-x-2 translate-y-2 bg-surface border border-[var(--color-border)] rounded-full p-2 shadow-sm cursor-pointer hover-surface-2"
                title="Cambiar avatar"
              >
                <Camera size={18} className="text-primary" />
                <input
                  id="avatar-upload"
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>

            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-primary">{name || "Nombre de usuario"}</h1>
              <p className="text-sm text-muted mt-1">{user?.email ?? "email@ejemplo.com"}</p>
            </div>
          </div>

          {/* Form body */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="username" className="text-sm font-medium text-primary">
                  Nombre de usuario
                </label>
                <input
                  id="username"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nombre de usuario"
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
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  placeholder="Alias"
                  className="w-full p-3 rounded-md bg-surface border border-[var(--color-border)] text-primary placeholder:text-muted focus:outline-none focus-ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="gender" className="text-sm font-medium text-primary">
                  Sexo
                </label>
                <select
                  id="gender"
                  value={sex}
                  onChange={(e) => setSex(e.target.value as NonNullable<User["sex"]>)}
                  className="w-full p-3 rounded-md bg-surface border border-[var(--color-border)] text-primary placeholder:text-muted focus:outline-none focus-ring-primary"
                >
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
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
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Cuenta algo sobre ti..."
                maxLength={300}
                className="w-full p-3 rounded-md bg-surface border border-[var(--color-border)] text-primary placeholder:text-muted focus:outline-none focus-ring-primary resize-vertical"
              />
              <p className="text-xs text-muted mt-1">{note.length}/300 caracteres.</p>
            </div>

            {message && (
              <p className={`text-sm ${message.type === "ok" ? "text-green-600" : "text-red-500"}`}>{message.text}</p>
            )}

            <div className="flex items-center justify-end gap-4 pt-2">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Cancelar"
                  onClick={() => {
                    navigate(`/user/${id}`);
                  }}
                  className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-primary bg-surface hover-surface-2 cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  aria-label="Guardar cambios"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg btn-primary cursor-pointer disabled:opacity-60"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {saving ? "Guardando..." : "Guardar"}
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