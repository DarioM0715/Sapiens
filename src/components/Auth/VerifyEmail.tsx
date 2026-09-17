//COMPONENTS
import { useAuthContext } from "@/context/AuthContext";
import { ButtonAction } from "@/shared/ui/ButtonAction";

//TYPES
import type { StepChanger, StringChanger } from "./registerTypes";

//HOOKS
import { useRef, useState } from "react";

//ICONS
import { MdEmail } from "react-icons/md";

const EMPTY_CODE = ["", "", "", "", "", ""];

type VerifyEmailProps = {
    registeredEmail: string;
    error: string;
    setError: StringChanger;
    success: string;
    setSuccess: StringChanger;
    setStep: StepChanger;
};

export const VerifyEmail = ({ registeredEmail, error, setError, success, setSuccess, setStep }: VerifyEmailProps) => {
    const { user, verifyEmail, resendCode } = useAuthContext();
    const [code, setCode] = useState<string[]>(EMPTY_CODE);
    const codeInputs = useRef<Array<HTMLInputElement | null>>([]);

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
            await resendCode({ email: registeredEmail });
            setCode(EMPTY_CODE);
            codeInputs.current[0]?.focus();
            setSuccess("Código reenviado. Revisa tu email.");
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            setError(err?.response?.data?.message || "Error al reenviar el código");
        }
    };

    return (
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

                {error && <p className="w-full text-center text-sm text-red-500">{error}</p>}
                {success && <p className="w-full text-center text-sm text-green-500">{success}</p>}
            </section>

            <div className="w-full">
                <ButtonAction
                    type="button"
                    color="primary"
                    className="w-full btn-primary"
                    aria-label="Verificar email"
                    onClick={() => void handleVerify()}
                >
                    Verificar y continuar
                </ButtonAction>
            </div>

            <button
                type="button"
                onClick={() => void handleResend()}
                className="text-sm text-primary hover:underline hover:text-primary-600 cursor-pointer"
            >
                ¿No recibiste el código? Reenviar
            </button>
        </div>
    );
};