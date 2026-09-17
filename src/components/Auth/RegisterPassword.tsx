//COMPONENTS
import { useAuthContext } from "@/context/AuthContext";
import { ButtonAction } from "@/shared/ui/ButtonAction";

//TYPES
import type { PASSWORD_FORM } from "@/types/formstypes";
import type { StepChanger, StringChanger } from "./registerTypes";
import { useForm } from "react-hook-form";
import { MdLockOutline } from "react-icons/md";

const passwordStrength = (password: string): number => {
    const rules = [
        password.length >= 8,
        /[A-Z]/.test(password),
        /[a-z]/.test(password),
        /\d/.test(password),
        /[^A-Za-z0-9]/.test(password),
    ];
    return rules.filter(Boolean).length;
};

const strengthLabel = (score: number): { label: string; color: string; width: string } => {
    if (score <= 1) return { label: "Débil", color: "bg-red-500", width: "20%" };
    if (score <= 3) return { label: "Media", color: "bg-yellow-500", width: "60%" };
    return { label: "Fuerte", color: "bg-green-500", width: "100%" };
};

type RegisterPasswordProps = {
    error: string;
    setError: StringChanger;
    setSuccess: StringChanger;
    setStep: StepChanger;
}

export const RegisterPassword = ({ error, setError, setSuccess, setStep }: RegisterPasswordProps) => {
    const { setPassword } = useAuthContext();

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

    return (
        <form
            onSubmit={handlePasswordSubmit(onPasswordSubmit)}
            className="flex flex-col items-center justify-center gap-6 w-full"
        >
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
                    {passwordErrors.password && (
                        <p className="mt-1 text-xs text-red-500">{passwordErrors.password.message}</p>
                    )}
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
    );
};
