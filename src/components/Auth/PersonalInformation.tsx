//HOOKS
import { useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";

//TYPES
import type { REGISTER_FORM } from "@/types/formstypes";
import type { User } from "@/types/users";
import type { StepChanger, StringChanger } from "./registerTypes";

//ICONS
import { ButtonAction } from "@/shared/ui/ButtonAction";
import { Buttonav } from "@/shared/ui/Buttonnav";
import { MdEmail, MdOutlineDriveFileRenameOutline, MdOutlinePerson } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type PersonalInformationProps = {
    registeredEmail: string;
    setRegisteredEmail: StringChanger;
    error: string;
    setError: StringChanger;
    setSuccess: StringChanger;
    setStep: StepChanger;
}

export const PersonalInformation = ({ registeredEmail, setRegisteredEmail, error, setError, setStep, setSuccess }: PersonalInformationProps) => {
    const [searchParams] = useSearchParams();
    const [sex, setSex] = useState<User["sex"]>("masculino");
    const { singup } = useAuthContext();

    const verifyParam = searchParams.get("verify") ?? "";

    const {
        register: registerPersonal,
        handleSubmit: handlePersonalSubmit,
        formState: { errors: personalErrors, isSubmitting: personalSubmitting },
    } = useForm<REGISTER_FORM>({
        defaultValues: { name: "", username: "", email: verifyParam },
    });

    const onPersonalSubmit = async (data: REGISTER_FORM) => {
        setError("");
        setSuccess("");
        try {
            if (data.email.toLowerCase() === registeredEmail.toLowerCase()) {
                setStep(1);
                return;
            }
            await singup({ name: data.name, username: data.username, email: data.email, sex });
            setRegisteredEmail(data.email);
            setStep(1);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            setError(err?.response?.data?.message || "Error al crear la cuenta");
        }
    };

    return (
        <form
            onSubmit={handlePersonalSubmit(onPersonalSubmit)}
            className="flex flex-col items-center justify-center gap-6 w-full"
        >
            <div className="flex flex-col items-center gap-3 text-center">
                <FaUserCircle size={80} className="text-primary" />
                <div>
                    <h1 className="text-3xl font-bold text-primary dark:text-white">Regístrate</h1>
                    <p className="mt-2 text-sm text-muted dark:text-gray-300">
                        Crea tu cuenta para compartir artículos, seguir a otros usuarios y participar en debates.
                    </p>
                </div>
            </div>
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
                    {personalErrors.email && (
                        <p className="mt-1 text-xs text-red-500">{personalErrors.email.message}</p>
                    )}
                </div>

                <div>
                    <div className="flex items-center gap-3 rounded-3xl border-default bg-surface-2 px-4 py-1">
                        <MdOutlinePerson size={24} className="text-primary" />
                        <select
                            value={sex}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => setSex(e.target.value as User["sex"])}
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
                <Buttonav
                    path="/login"
                    className="text-primary hover:underline hover:text-primary-600 visited:text-primary cursor-pointer"
                >
                    ¿Ya tienes una cuenta? Prueba iniciar sesion
                </Buttonav>
            </div>
        </form>
    );
};
