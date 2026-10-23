//HOOKS
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

//COMPONENTS
import { PersonalInformation } from "./PersonalInformation";
import { VerifyEmail } from "./VerifyEmail";
import { RegisterPassword } from "./RegisterPassword";
import { TermsConditions } from "./TermsConditions";

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
    const [searchParams] = useSearchParams();
    const verifyParam = searchParams.get("verify") ?? "";
    const [step, setStep] = useState<number>(0);
    const [registeredEmail, setRegisteredEmail] = useState(verifyParam);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const goToStep = (index: number) => {
        setError("");
        setSuccess("");
        setStep(index);
    };

    return (
        <div className="auth-bg flex flex-col gap-6 items-center justify-center w-full min-h-screen p-6 bg-surface text-primary">
            <div className="flex w-full max-w-6xl items-center justify-center">
                <div className="auth-card">
                    <div className="flex flex-col items-center justify-center gap-8 py-8 px-6 sm:px-10 w-full">
                        <Stepper current={step} onStepClick={goToStep} />

                        {step === 0 && (
                            <PersonalInformation
                                registeredEmail={registeredEmail}
                                setRegisteredEmail={setRegisteredEmail}
                                error={error}
                                setError={setError}
                                setSuccess={setSuccess}
                                setStep={setStep}
                            />
                        )}

                        {step === 1 && (
                            <VerifyEmail
                                registeredEmail={registeredEmail}
                                error={error}
                                setError={setError}
                                success={success}
                                setSuccess={setSuccess}
                                setStep={setStep}
                            />
                        )}

                        {step === 2 && <RegisterPassword error={error} setError={setError} setSuccess={setSuccess} setStep={setStep} />}

                        {step === 3 && <TermsConditions error={error} setError={setError} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;