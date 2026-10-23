import { useState } from "react";
import { useForm } from "react-hook-form";
import { useIsDesktop } from "@/shared/ui/useIsDesktop";

type FormValues = {
  email: string;
  role: string;
  message?: string;
  expiresInDays: number;
};

const INVITE_ENDPOINT = "/api/invitations";

const InviteUser = () => {
  const isDesktop = useIsDesktop(1024);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({ mode: "onTouched", defaultValues: { role: "user", expiresInDays: 7 } });

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);

  const onSubmit = async (data: FormValues) => {
    setServerError(null);
    setSuccessMsg(null);
    setInviteUrl(null);
    setLoading(true);

    try {
      const res = await fetch(INVITE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: data.email,
          role: data.role,
          message: data.message,
          expiresInDays: data.expiresInDays,
        }),
      });

      if (res.ok) {
        // Se espera que el backend devuelva { inviteUrl?: string, message?: string }
        const json = await res.json().catch(() => ({}));
        if (json?.inviteUrl) {
          setInviteUrl(json.inviteUrl);
          setSuccessMsg("Invitación creada y enviada. También puedes copiar el enlace de invitación.");
        } else {
          setSuccessMsg(json?.message ?? "Invitación enviada correctamente.");
        }
        reset();
      } else {
        let errText = "Error al enviar la invitación.";
        try {
          const json = await res.json();
          if (json?.message) errText = json.message;
        } catch {
          errText = `${res.status} ${res.statusText}`;
        }
        setServerError(errText);
      }
    } catch (err) {
      setServerError("Error de red. Comprueba tu conexión.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text?: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setSuccessMsg("Enlace copiado al portapapeles.");
    } catch {
      setServerError("No se pudo copiar el enlace. Usa Ctrl+C o intenta de nuevo.");
    }
  };

  const openMailClient = (to?: string, subject?: string, body?: string) => {
    if (!to) return;
    const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject ?? "Invitación")}&body=${encodeURIComponent(body ?? "")}`;
    window.location.href = mailto;
  };

  return (
    <div className="bg-surface flex items-start justify-center py-10 px-4">
      <div className={`w-full ${isDesktop ? "max-w-2xl" : "max-w-lg mx-auto"} bg-surface-2 rounded-lg border-default shadow-md p-6`}>
        <h1 className="text-2xl font-semibold text-primary mb-2">Invitar usuario</h1>
        <p className="text-sm text-muted mb-6">
          Envía una invitación por correo para que un nuevo usuario se una a la aplicación. Puedes incluir un mensaje personalizado y seleccionar el rol que tendrá.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-primary mb-1">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              {...register("email", {
                required: "Introduce el correo electrónico del invitado",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Introduce un email válido" },
              })}
              className={`w-full px-3 py-2 rounded-md bg-surface border ${errors.email ? "border-red-500" : "border-[var(--color-border)]"} text-primary placeholder:text-muted focus-ring-primary outline-none`}
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
              autoComplete="email"
            />
            {errors.email && (
              <p id="email-error" className="text-xs text-red-400 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="role" className="block text-sm text-primary mb-1">
              Rol del invitado
            </label>
            <select
              id="role"
              {...register("role")}
              className="w-full px-3 py-2 rounded-md bg-surface border border-[var(--color-border)] text-primary focus-ring-primary outline-none"
            >
              <option value="user">Usuario</option>
              <option value="moderator">Moderador</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm text-primary mb-1">
              Mensaje opcional
            </label>
            <textarea
              id="message"
              rows={3}
              {...register("message")}
              className="w-full px-3 py-2 rounded-md bg-surface border border-[var(--color-border)] text-primary placeholder:text-muted focus-ring-primary outline-none resize-y"
              placeholder="Hola, te invito a unirte a nuestra plataforma..."
            />
          </div>

          <div>
            <label htmlFor="expiresInDays" className="block text-sm text-primary mb-1">
              Caducidad del enlace (días)
            </label>
            <select
              id="expiresInDays"
              {...register("expiresInDays", { valueAsNumber: true })}
              className="w-40 px-3 py-2 rounded-md bg-surface border border-[var(--color-border)] text-primary focus-ring-primary outline-none"
            >
              <option value={1}>1 día</option>
              <option value={3}>3 días</option>
              <option value={7}>7 días</option>
              <option value={30}>30 días</option>
            </select>
            <p className="text-xs text-muted mt-1">El enlace de invitación expirará después de este periodo.</p>
          </div>

          {serverError && <div className="text-sm text-red-400">{serverError}</div>}
          {successMsg && <div className="text-sm text-success">{successMsg}</div>}

          {inviteUrl && (
            <div className="mt-2 p-3 rounded-md bg-surface border border-[var(--color-border)]">
              <label className="text-xs text-muted block mb-1">Enlace de invitación</label>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={inviteUrl}
                  className="flex-1 px-2 py-1 rounded-md bg-surface text-sm text-primary border border-[var(--color-border)] outline-none"
                  aria-label="Enlace de invitación"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(inviteUrl)}
                  className="px-3 py-1 rounded-md text-sm bg-surface-2 border border-[var(--color-border)] hover:bg-surface transition"
                  aria-label="Copiar enlace de invitación"
                >
                  Copiar
                </button>

                <button
                  type="button"
                  onClick={() => openMailClient("", "Te he invitado a probar nuestra app", `Únete usando este enlace:\n\n${inviteUrl}`)}
                  className="px-3 py-1 rounded-md text-sm bg-surface-2 border border-[var(--color-border)] hover:bg-surface transition"
                  aria-label="Abrir cliente de correo"
                >
                  Abrir correo
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 mt-2">
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 text-white rounded-md text-sm font-medium transition ${loading ? "bg-[color:var(--color-border)] cursor-not-allowed" : "btn-primary"}`}
            >
              {loading ? "Enviando..." : "Enviar invitación"}
            </button>

            <button
              type="button"
              onClick={() => {
                reset();
                setServerError(null);
                setSuccessMsg(null);
                setInviteUrl(null);
              }}
              className="px-3 py-2 rounded-md text-sm bg-surface text-primary border border-[var(--color-border)] hover-surface-2 transition"
            >
              Limpiar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteUser;
