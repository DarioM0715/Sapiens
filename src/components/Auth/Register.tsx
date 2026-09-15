//REACT
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";

//CONTEXT
import { useAuthContext } from "@/context/AuthContext";

//COMPONENTS
import { ButtonAction } from "@/shared/ui/ButtonAction";
import { Buttonav } from "@/shared/ui/Buttonnav";

//ICONS
import { BsGoogle } from "react-icons/bs";
import { MdOutlinePerson } from "react-icons/md";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import { MdLockOutline } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";

//TYPES
import type { REGISTER_FORM, PASSWORD_FORM } from "@/types/formstypes";

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const passwordStrength = (password: string) => {
  const rules = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  return rules.filter(Boolean).length;
};

const strengthLabel = (score: number) => {
  if (score <= 1) return { label: "Débil", color: "bg-red-500", width: "20%" };
  if (score <= 3) return { label: "Media", color: "bg-yellow-500", width: "60%" };
  return { label: "Fuerte", color: "bg-green-500", width: "100%" };
};

const STEPS = ["Datos personales", "Verifica tu email", "Configura tu contraseña", "Términos y condiciones"];

const Stepper = ({ current, onStepClick }: { current: number; onStepClick: (index: number) => void }) => {
  return (
    <ol className="flex w-full items-center gap-2">
      {STEPS.map((label, index) => {
        const done = index < current;
        const active = index === current;
        const canGoBack = index < current;
        return (
          <li key={label} className="flex flex-1 flex-col items-center gap-1.5">
            <button
              type="button"
              onClick={() => onStepClick(index)}
              disabled={!canGoBack}
              aria-label={label}
              title={canGoBack ? `Volver a ${label}` : undefined}
              className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold transition
                ${canGoBack ? "border-green-500 bg-green-500 text-white hover:opacity-80 cursor-pointer" : ""}
                ${active ? "border-blue-500 text-blue-600 dark:text-blue-300" : ""}
                ${!done && !active ? "border-gray-400 text-muted cursor-not-allowed" : ""}`}
            >
              {done ? "✓" : index + 1}
            </button>
            <span
              className={`hidden text-center text-[11px] leading-tight sm:block ${
                active ? "font-semibold text-primary" : "text-muted"
              }`}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
};

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, singup, verifyEmail, resendCode, setPassword, acceptTerms } = useAuthContext();

  const verifyParam = searchParams.get("verify") ?? "";
  const [step, setStep] = useState<number>(0);
  const [registeredEmail, setRegisteredEmail] = useState(verifyParam);
  const [devCode, setDevCode] = useState("");
  const [sex, setSex] = useState<"masculino" | "femenino" | "otro">("masculino");
  const [termsChecked, setTermsChecked] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [code, setCode] = useState(Array(6).fill(""));
  const codeInputs = useRef<Array<HTMLInputElement | null>>([]);

  const {
    register: registerPersonal,
    handleSubmit: handlePersonalSubmit,
    formState: { errors: personalErrors, isSubmitting: personalSubmitting },
  } = useForm<REGISTER_FORM>({
    defaultValues: { name: "", username: "", email: verifyParam },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    watch,
    formState: { errors: passwordErrors, isSubmitting: passwordSubmitting },
  } = useForm<PASSWORD_FORM>({
    defaultValues: { password: "", confirm_password: "" },
  });

  const password = watch("password");
  const strength = passwordStrength(password ?? "");
  const strengthBar = strengthLabel(strength);

  useEffect(() => {
    if (user?.emailVerified && step === 0) {
      setStep(2);
    }
  }, [user?.emailVerified, step]);

  const onPersonalSubmit = async (data: REGISTER_FORM) => {
    setError("");
    setSuccess("");
    try {
      if (data.email.toLowerCase() === registeredEmail.toLowerCase()) {
        setStep(1);
        return;
      }
      const res = await singup({ name: data.name, username: data.username, email: data.email, sex });
      setRegisteredEmail(data.email);
      if (res?.devCode) setDevCode(res.devCode);
      setStep(1);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setError(err?.response?.data?.message || "Error al crear la cuenta");
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;
    const next = [...code];
    next[index] = value.slice(-1);
    setCode(next);
    if (value && index < 5) {
      codeInputs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      codeInputs.current[index - 1]?.focus();
    }
  };

  const goToStep = (index: number) => {
    setError("");
    setSuccess("");
    setStep(index);
  };

  const handleVerify = async () => {
    setError("");
    setSuccess("");
    if (user?.emailVerified) {
      setStep(2);
      return;
    }
    try {
      await verifyEmail({ email: registeredEmail, code: code.join("") });
      setStep(2);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setError(err?.response?.data?.message || "Error al verificar el código");
    }
  };

  const handleResend = async () => {
    setError("");
    setSuccess("");
    try {
      const res = await resendCode({ email: registeredEmail });
      if (res?.devCode) setDevCode(res.devCode);
      setCode(Array(6).fill(""));
      codeInputs.current[0]?.focus();
      setSuccess("Código reenviado. Revisa tu email.");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setError(err?.response?.data?.message || "Error al reenviar el código");
    }
  };

  const onPasswordSubmit = async (data: PASSWORD_FORM) => {
    setError("");
    setSuccess("");
    try {
      await setPassword({ password: data.password });
      setStep(3);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setError(err?.response?.data?.message || "Error al configurar la contraseña");
    }
  };

  const onTermsSubmit = async () => {
    setError("");
    setSuccess("");
    if (!termsChecked) {
      setError("Debes aceptar los términos y condiciones para continuar");
      return;
    }
    try {
      await acceptTerms();
      navigate("/home");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setError(err?.response?.data?.message || "Error al completar el registro");
    }
  };

  const cardHeader = (
    <div className="flex flex-col items-center gap-3 text-center">
      <FaUserCircle size={80} className="text-primary" />
      <div>
        <h1 className="text-3xl font-bold text-primary dark:text-white">Regístrate</h1>
        <p className="mt-2 text-sm text-muted dark:text-gray-300">
          Crea tu cuenta para compartir artículos, seguir a otros usuarios y participar en debates.
        </p>
      </div>
    </div>
  );

  return (
    <div className="auth-bg flex flex-col gap-6 items-center justify-center w-full min-h-screen p-6 bg-surface text-primary">
      <div className="flex w-full max-w-6xl items-center justify-center">
        <div className="auth-card">
          <div className="flex flex-col items-center justify-center gap-8 py-8 px-6 sm:px-10 w-full">
            <Stepper current={step} onStepClick={goToStep} />

            {step === 0 && (
              <form
                onSubmit={handlePersonalSubmit(onPersonalSubmit)}
                className="flex flex-col items-center justify-center gap-6 w-full"
              >
                {cardHeader}

                <section className="flex flex-col gap-4 w-full">
                  <div>
                    <div className="flex items-center gap-3 rounded-3xl border-default bg-surface-2 px-4 py-1">
                      <MdOutlineDriveFileRenameOutline size={24} className="text-primary" />
                      <input
                        {...registerPersonal("name", { required: "Ingresa tu nombre completo" })}
                        type="text"
                        placeholder="Nombre completo"
                        autoComplete="name"
                        className="input-underline"
                      />
                    </div>
                    {personalErrors.name && <p className="mt-1 text-xs text-red-500">{personalErrors.name.message}</p>}
                  </div>

                  <div>
                    <div className="flex items-center gap-3 rounded-3xl border-default bg-surface-2 px-4 py-1">
                      <MdOutlinePerson size={24} className="text-primary" />
                      <input
                        {...registerPersonal("username", {
                          required: "Ingresa tu nombre de usuario",
                          pattern: {
                            value: USERNAME_REGEX,
                            message: "Mínimo 3 caracteres, solo letras, números y guión bajo",
                          },
                        })}
                        type="text"
                        placeholder="Nombre de usuario"
                        autoComplete="username"
                        className="input-underline"
                      />
                    </div>
                    {personalErrors.username && (
                      <p className="mt-1 text-xs text-red-500">{personalErrors.username.message}</p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-3 rounded-3xl border-default bg-surface-2 px-4 py-1">
                      <MdEmail size={22} className="text-primary" />
                      <input
                        {...registerPersonal("email", {
                          required: "Ingresa tu email",
                          pattern: {
                            value: EMAIL_REGEX,
                            message: "Ingresa un email válido",
                          },
                        })}
                        type="email"
                        placeholder="Email"
                        autoComplete="email"
                        className="input-underline"
                      />
                    </div>
                    {personalErrors.email && <p className="mt-1 text-xs text-red-500">{personalErrors.email.message}</p>}
                  </div>

                  <div>
                    <div className="flex items-center gap-3 rounded-3xl border-default bg-surface-2 px-4 py-1">
                      <MdOutlinePerson size={24} className="text-primary" />
                      <select
                        value={sex}
                        onChange={(e) => setSex(e.target.value as "masculino" | "femenino" | "otro")}
                        className="input-underline bg-transparent cursor-pointer"
                        aria-label="Género"
                      >
                        <option value="masculino">Masculino</option>
                        <option value="femenino">Femenino</option>
                        <option value="otro">Otro</option>
                      </select>
                    </div>
                  </div>
                </section>

                {error && <p className="w-full text-center text-sm text-red-500">{error}</p>}

                <div className="w-full">
                  <ButtonAction
                    type="submit"
                    color="primary"
                    className="w-full btn-primary"
                    aria-label="Continuar registro"
                    disabled={personalSubmitting}
                  >
                    {personalSubmitting ? "Continuando..." : "Continuar"}
                  </ButtonAction>
                </div>

                <div className="flex w-full justify-between text-sm">
                  <Buttonav path="/login" className="text-primary hover:underline hover:text-primary-600 visited:text-primary cursor-pointer">
                    ¿Ya tienes una cuenta? Prueba iniciar sesion
                  </Buttonav>
                </div>
              </form>
            )}

            {step === 1 && (
              <div className="flex flex-col items-center justify-center gap-8 w-full">
                <div className="flex flex-col items-center gap-3 text-center">
                  <MdEmail size={70} className="text-primary" />
                  <div>
                    <h1 className="text-3xl font-bold text-primary dark:text-white">Verifica tu email</h1>
                    <p className="mt-2 text-sm text-muted dark:text-gray-300">
                      Enviamos un código de 6 dígitos a{" "}
                      <span className="font-semibold text-primary">{registeredEmail}</span>. Ingresa el código para
                      continuar.
                    </p>
                  </div>
                </div>

                <section className="flex flex-col gap-5 w-full">
                  {user?.emailVerified && (
                    <p className="w-full text-center text-sm text-green-500">
                      Tu email ya está verificado. Continúa con la configuración de tu cuenta.
                    </p>
                  )}
                  <div className="flex justify-center gap-3">
                    {code.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => {
                          codeInputs.current[index] = el;
                        }}
                        value={digit}
                        onChange={(e) => handleCodeChange(index, e.target.value)}
                        onKeyDown={(e) => handleCodeKeyDown(index, e)}
                        inputMode="numeric"
                        maxLength={1}
                        autoFocus={index === 0}
                        aria-label={`Dígito ${index + 1}`}
                        className="w-12 h-14 text-center text-2xl font-bold rounded-xl border-default bg-surface-2 text-primary outline-none focus:ring-2 focus-ring-primary"
                      />
                    ))}
                  </div>

                  {devCode && (
                    <p className="w-full text-center text-sm text-muted dark:text-gray-300">
                      Modo desarrollo, tu código es: <span className="font-semibold text-primary">{devCode}</span>
                    </p>
                  )}

                  {error && <p className="w-full text-center text-sm text-red-500">{error}</p>}
                  {success && <p className="w-full text-center text-sm text-green-500">{success}</p>}
                </section>

                <div className="w-full">
                  <ButtonAction type="button" color="primary" className="w-full btn-primary" aria-label="Verificar email" onClick={handleVerify}>
                    Verificar y continuar
                  </ButtonAction>
                </div>

                <button
                  type="button"
                  onClick={handleResend}
                  className="text-sm text-primary hover:underline hover:text-primary-600 cursor-pointer"
                >
                  ¿No recibiste el código? Reenviar
                </button>
              </div>
            )}

            {step === 2 && (
              <form
                onSubmit={handlePasswordSubmit(onPasswordSubmit)}
                className="flex flex-col items-center justify-center gap-6 w-full"
              >
                {cardHeader}

                <section className="flex flex-col gap-4 w-full">
                  <div>
                    <div className="flex items-center gap-3 rounded-3xl border-default bg-surface-2 px-4 py-1">
                      <MdLockOutline size={22} className="text-primary" />
                      <input
                        {...registerPassword("password", {
                          required: "Ingresa una contraseña",
                          minLength: {
                            value: 8,
                            message: "La contraseña debe tener al menos 8 caracteres",
                          },
                        })}
                        type="password"
                        placeholder="Nueva contraseña"
                        autoComplete="new-password"
                        className="input-underline"
                      />
                    </div>
                    {password && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-surface-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${strengthBar.color}`}
                            style={{ width: strengthBar.width }}
                          />
                        </div>
                        <span className="text-xs text-muted">{strengthBar.label}</span>
                      </div>
                    )}
                    {passwordErrors.password && <p className="mt-1 text-xs text-red-500">{passwordErrors.password.message}</p>}
                  </div>

                  <div>
                    <div className="flex items-center gap-3 rounded-3xl border-default bg-surface-2 px-4 py-1">
                      <MdLockOutline size={22} className="text-primary" />
                      <input
                        {...registerPassword("confirm_password", {
                          required: "Confirma tu contraseña",
                          validate: (value) => value === password || "Las contraseñas no coinciden",
                        })}
                        type="password"
                        placeholder="Confirmar contraseña"
                        autoComplete="new-password"
                        className="input-underline"
                      />
                    </div>
                    {passwordErrors.confirm_password && (
                      <p className="mt-1 text-xs text-red-500">{passwordErrors.confirm_password.message}</p>
                    )}
                  </div>
                </section>

                {error && <p className="w-full text-center text-sm text-red-500">{error}</p>}

                <div className="w-full">
                  <ButtonAction
                    type="submit"
                    color="primary"
                    className="w-full btn-primary"
                    aria-label="Configurar contraseña"
                    disabled={passwordSubmitting}
                  >
                    {passwordSubmitting ? "Guardando..." : "Continuar"}
                  </ButtonAction>
                </div>
              </form>
            )}

            {step === 3 && (
              <div className="flex flex-col items-center justify-center gap-6 w-full">
                {cardHeader}

                <section className="flex flex-col gap-4 w-full border-default bg-surface-2 rounded-2xl p-4 max-h-64 overflow-y-auto text-sm text-muted dark:text-gray-300 leading-relaxed">
                  <h2 className="text-lg font-bold text-primary">Términos y condiciones</h2>
                  <p>
                    Bienvenido/a a Sapiens. Al crear tu cuenta aceptas los siguientes términos:
                  </p>
                  <ul className="list-disc pl-5 flex flex-col gap-2">
                    <li>
                      Eres responsable del contenido que publicas y de respetar los derechos de autor y propiedad
                      intelectual.
                    </li>
                    <li>
                      No está permitido difundir contenido ilegal, difamatorio, discriminatorio o que incite al odio.
                    </li>
                    <li>
                      Tus datos personales serán tratados conforme a la política de privacidad y nunca serán vendidos a
                      terceros.
                    </li>
                    <li>
                      Podrás solicitar la eliminación de tu cuenta y de tus datos en cualquier momento.
                    </li>
                    <li>
                      Nos reservamos el derecho de moderar el contenido y suspender cuentas que incumplan estas normas.
                    </li>
                  </ul>
                  <p>Si tienes dudas, contacta con el equipo de administración.</p>
                </section>

                <label className="flex items-start gap-2 text-sm text-muted cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsChecked}
                    onChange={(e) => setTermsChecked(e.target.checked)}
                    className="mt-0.5 accent-primary"
                  />
                  <span>
                    He leído y acepto los <span className="text-primary underline">términos y condiciones</span> y la{" "}
                    <span className="text-primary underline">política de privacidad</span>
                  </span>
                </label>

                {error && <p className="w-full text-center text-sm text-red-500">{error}</p>}

                <div className="w-full">
                  <ButtonAction type="button" color="primary" className="w-full btn-primary" aria-label="Crear cuenta" onClick={onTermsSubmit}>
                    Crear cuenta
                  </ButtonAction>
                </div>

                <ButtonAction type="button" color="primary" className="btn-primary flex items-center gap-4 w-full">
                  <BsGoogle size={24} />
                  Crear cuenta con Google
                </ButtonAction>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;