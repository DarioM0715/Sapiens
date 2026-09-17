//ICONS
import { BsGoogle } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

//HOOKS
import { useAuthContext } from "@/context/AuthContext";

//COMPONENTS
import { ButtonAction } from "@/shared/ui/ButtonAction";
import type { StringChanger } from "./registerTypes";
import { useState } from "react";

type TermsConditionsProps = {
    error: string;
    setError: StringChanger;
}

export const TermsConditions = ({ error, setError }: TermsConditionsProps) => {
    const navigate = useNavigate();
    const { acceptTerms } = useAuthContext();
    const [termsChecked, setTermsChecked] = useState(false);

    const onTermsSubmit = async () => {
        setError("");
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

    return (
        <div className="flex flex-col items-center justify-center gap-6 w-full">
            <div className="flex flex-col items-center gap-3 text-center">
                <FaUserCircle size={80} className="text-primary" />
                <div>
                    <h1 className="text-3xl font-bold text-primary dark:text-white">Regístrate</h1>
                    <p className="mt-2 text-sm text-muted dark:text-gray-300">
                        Crea tu cuenta para compartir artículos, seguir a otros usuarios y participar en debates.
                    </p>
                </div>
            </div>

            <section className="flex flex-col gap-4 w-full border-default bg-surface-2 rounded-2xl p-4 max-h-64 overflow-y-auto text-sm text-muted dark:text-gray-300 leading-relaxed">
                <h2 className="text-lg font-bold text-primary">Términos y condiciones</h2>
                <p>Bienvenido/a a Sapiens. Al crear tu cuenta aceptas los siguientes términos:</p>
                <ul className="list-disc pl-5 flex flex-col gap-2">
                    <li>
                        Eres responsable del contenido que publicas y de respetar los derechos de autor y propiedad
                        intelectual.
                    </li>
                    <li>
                        No está permitido difundir contenido ilegal, difamatorio, discriminatorio o que incite al odio.
                    </li>
                    <li>
                        Tus datos personales serán tratados conforme a la política de privacidad y nunca serán vendidos
                        a terceros.
                    </li>
                    <li>Podrás solicitar la eliminación de tu cuenta y de tus datos en cualquier momento.</li>
                    <li>
                        Nos reservamos el derecho de moderar el contenido y suspender cuentas que incumplan estas
                        normas.
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
                <ButtonAction
                    type="button"
                    color="primary"
                    className="w-full btn-primary"
                    aria-label="Crear cuenta"
                    onClick={onTermsSubmit}
                >
                    Crear cuenta
                </ButtonAction>
            </div>

            <ButtonAction type="button" color="primary" className="btn-primary flex items-center gap-4 w-full">
                <BsGoogle size={24} />
                Crear cuenta con Google
            </ButtonAction>
        </div>
    );
};
