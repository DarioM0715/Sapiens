import { useState } from "react";
import { useForm } from "react-hook-form";
import { useIsDesktop } from "@/shared/ui/useIsDesktop";
import { useSearchParams, Link } from "react-router-dom";

type FormValues = {
  newPassword: string;
  confirmPassword: string;
};

const RESET_PASSWORD_ENDPOINT = "/api/auth/reset-password";

const ResetPassword = () => {
  const isDesktop = useIsDesktop(1024);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormValues>({ mode: "onTouched" });

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const newPassword = watch("newPassword", "");

  const onSubmit = async (data: FormValues) => {
    setServerError(null);
    setSuccessMsg(null);

    if (!token) {
      setServerError("Token de recuperación no encontrado. Asegúrate de usar el enlace recibido por correo.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(RESET_PASSWORD_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: data.newPassword }),
      });

      if (res.ok) {
        setSuccessMsg("Contraseña restablecida correctamente. Ya puedes iniciar sesión con tu nueva contraseña.");
        reset();
      } else {
        let errText = "Error al restablecer la contraseña.";
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

  return (
    <div className="bg-surface flex items-start justify-center py-10 px-4">
      <div className={`w-full ${isDesktop ? "max-w-2xl" : "max-w-lg mx-auto"} bg-surface-2 rounded-lg border-default shadow-md p-6`}>
        <h1 className="text-2xl font-semibold text-primary mb-2">Restablecer contraseña</h1>
        <p className="text-sm text-muted mb-6">Introduce tu nueva contraseña. El enlace de recuperación contiene un token que valida esta operación.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="newPassword" className="block text-sm text-primary mb-1">
              Nueva contraseña
            </label>

            <div className="relative">
              <input
                id="newPassword"
                type={showNew ? "text" : "password"}
                {...register("newPassword", {
                  required: "Introduce una nueva contraseña",
                  minLength: { value: 8, message: "La contraseña debe tener al menos 8 caracteres" },
                })}
                className={`w-full pr-20 px-3 py-2 rounded-md bg-surface border ${errors.newPassword ? "border-red-500" : "border-[var(--color-border)]"} text-primary placeholder:text-muted focus-ring-primary outline-none`}
                aria-invalid={errors.newPassword ? "true" : "false"}
                aria-describedby={errors.newPassword ? "newPassword-error" : undefined}
                autoComplete="new-password"
              />

              <button
                type="button"
                onClick={() => setShowNew((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-primary hover:text-[var(--color-primary-600)]"
                aria-label={showNew ? "Ocultar nueva contraseña" : "Mostrar nueva contraseña"}
              >
                {showNew ? "Ocultar" : "Mostrar"}
              </button>
            </div>

            {errors.newPassword && (
              <p id="newPassword-error" className="text-xs text-red-400 mt-1">
                {errors.newPassword.message}
              </p>
            )}

            <p className="text-xs text-muted mt-2">Consejo: combina mayúsculas, minúsculas y números para mayor seguridad.</p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm text-primary mb-1">
              Confirmar nueva contraseña
            </label>

            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                {...register("confirmPassword", {
                  required: "Confirma la nueva contraseña",
                  validate: (val) => (val === newPassword ? true : "Las contraseñas no coinciden"),
                })}
                className={`w-full pr-20 px-3 py-2 rounded-md bg-surface border ${errors.confirmPassword ? "border-red-500" : "border-[var(--color-border)]"} text-primary placeholder:text-muted focus-ring-primary outline-none`}
                aria-invalid={errors.confirmPassword ? "true" : "false"}
                aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                autoComplete="new-password"
              />

              <button
                type="button"
                onClick={() => setShowConfirm((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-primary hover:text-[var(--color-primary-600)]"
                aria-label={showConfirm ? "Ocultar confirmar contraseña" : "Mostrar confirmar contraseña"}
              >
                {showConfirm ? "Ocultar" : "Mostrar"}
              </button>
            </div>

            {errors.confirmPassword && (
              <p id="confirmPassword-error" className="text-xs text-red-400 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {serverError && <div className="text-sm text-red-400">{serverError}</div>}
          {successMsg && <div className="text-sm text-success">{successMsg}</div>}

          <div className="flex items-center gap-3 mt-2">
            <button
              type="submit"
              disabled={loading || !token}
              className={`px-4 py-2 text-white rounded-md text-sm font-medium transition ${loading ? "bg-[color:var(--color-border)] cursor-not-allowed" : "btn-primary"}`}
            >
              {loading ? "Restableciendo..." : "Restablecer contraseña"}
            </button>

            <button
              type="button"
              onClick={() => {
                reset();
                setServerError(null);
                setSuccessMsg(null);
              }}
              className="px-3 py-2 rounded-md text-sm bg-surface text-primary border border-[var(--color-border)] hover-surface-2 transition"
            >
              Limpiar
            </button>

            <Link to="/auth/login" className="ml-auto text-sm text-primary hover:underline">
              Volver al inicio de sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
