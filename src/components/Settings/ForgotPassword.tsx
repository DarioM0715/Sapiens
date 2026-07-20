import { useState } from "react";
import { useForm } from "react-hook-form";
import { useIsDesktop } from "@/shared/ui/useIsDesktop";
import { Link } from "react-router-dom";

type FormValues = {
  email: string;
};

const REQUEST_RESET_ENDPOINT = "/api/auth/forgot-password";

const ForgotPassword = () => {
  const isDesktop = useIsDesktop(1024);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({ mode: "onTouched" });

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const onSubmit = async (data: FormValues) => {
    setServerError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const res = await fetch(REQUEST_RESET_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      // Para no filtrar si el email existe, devolver siempre un mensaje genérico
      if (res.ok) {
        setSuccessMsg("Si existe una cuenta asociada a ese correo, te hemos enviado un enlace para recuperar la contraseña.");
        reset();
      } else {
        let errText = "Error al solicitar recuperación de contraseña.";
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
        <h1 className="text-2xl font-semibold text-primary mb-2">Recuperar contraseña</h1>
        <p className="text-sm text-muted mb-6">Introduce el correo electrónico asociado a tu cuenta. Te enviaremos un enlace para restablecer la contraseña.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-primary mb-1">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              {...register("email", {
                required: "Introduce tu correo electrónico",
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

          {serverError && <div className="text-sm text-red-400">{serverError}</div>}
          {successMsg && <div className="text-sm text-success">{successMsg}</div>}

          <div className="flex items-center gap-3 mt-2">
            <button type="submit" disabled={loading} className={`px-4 py-2 text-white rounded-md text-sm font-medium transition ${loading ? "bg-[color:var(--color-border)] cursor-not-allowed" : "btn-primary"}`}>
              {loading ? "Enviando..." : "Enviar enlace de recuperación"}
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

export default ForgotPassword;
