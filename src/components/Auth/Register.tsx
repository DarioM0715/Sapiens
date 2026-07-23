//REACT
import { useForm } from "react-hook-form";

//COMPONENTS
import { ButtonAction } from "@/shared/ui/ButtonAction";
import { Buttonav } from "@/shared/ui/Buttonnav";

//ICONS
import { BsGoogle } from "react-icons/bs";
import { MdOutlinePerson } from "react-icons/md";
import { MdLockOutline } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";

//TYPES
import type { REGISTER_FORM } from "@/types/formstypes";

const Register = () => {
  const { handleSubmit, register } = useForm<REGISTER_FORM>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  const onSubmit = (data: REGISTER_FORM) => {
    console.log("submit", data);
  };

  return (
    <div className="auth-bg flex flex-col gap-6 items-center justify-center w-full min-h-screen p-6 bg-surface text-primary">
      <div className="flex w-full max-w-6xl items-center justify-center">
        <div className="auth-card">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center justify-center gap-8 py-8 px-6 sm:px-10 w-full max-w-lg"
          >
            <div className="flex flex-col items-center gap-3 text-center">
              <FaUserCircle size={90} className="text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-primary dark:text-white">Regístrate</h1>
                <p className="mt-2 text-sm text-muted dark:text-gray-300">
                  Crea tu cuenta para compartir artículos, seguir a otros usuarios y participar en debates.
                </p>
              </div>
            </div>

            <section className="flex flex-col gap-5 w-full">
            <div className="flex items-center gap-3 rounded-3xl border-default bg-surface-2 px-4 py-1">
              <MdOutlinePerson size={24} className="text-primary" />
              <input {...register("username")} name="username" type="text" placeholder="Nombre de usuario" className="input-underline" />
            </div>

            <div className="flex items-center gap-3 rounded-3xl border-default bg-surface-2 px-4 py-1">
              <MdOutlinePerson size={24} className="text-primary" />
              <input {...register("email")} name="email" type="email" placeholder="Email" className="input-underline" />
            </div>

            <div className="flex items-center gap-3 rounded-3xl border-default bg-surface-2 px-4 py-1">
              <MdLockOutline size={22} className="text-primary" />
              <input {...register("password")} name="password" type="password" placeholder="Contraseña" className="input-underline" />
            </div>

            <div className="flex items-center gap-3 rounded-3xl border-default bg-surface-2 px-4 py-1">
              <MdLockOutline size={22} className="text-primary" />
              <input
                {...register("confirm_password")}
                name="confirm_password"
                type="password"
                placeholder="Confirmar contraseña"
                className="input-underline"
              />
            </div>
          </section>

          <div className="flex w-full justify-between text-sm">
            <Buttonav path="/login" className="text-primary hover:underline hover:text-primary-600 visited:text-primary cursor-pointer">
              ¿Ya tienes una cuenta? Prueba iniciar sesion
            </Buttonav>
          </div>

          <div className="w-full">
            <ButtonAction type="submit" color="primary" className="w-full btn-primary" aria-label="Crear cuenta">
              Crear cuenta
            </ButtonAction>
          </div>

          <ButtonAction type="button" color="primary" className="btn-primary flex items-center gap-4 w-full">
            <BsGoogle size={24} />
            Crear cuenta con Google
          </ButtonAction>
        </form>
      </div>
     
    </div>
  </div>
  );
};

export default Register;
