//REACT
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

//CONTEXT
import { useAuthContext } from "@/context/AuthContext";

//COMPONENTS
import { Buttonav } from "@/shared/ui/Buttonnav";
import { ButtonAction } from "@/shared/ui/ButtonAction";

// ICONS
import { MdOutlinePerson } from "react-icons/md";
import { MdLockOutline } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { BsGoogle } from "react-icons/bs";

//TYPES
import type { LOGIN_FORM } from "@/types/formstypes";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthContext();
  const { register, handleSubmit } = useForm<LOGIN_FORM>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LOGIN_FORM) => {
    try {
      await login(data)
      navigate("/home")
    } catch (e) {
      console.log("Ha ocurrido un error")
    }
  };

  return (
    <div className="auth-bg flex flex-col gap-6 items-center justify-center w-full min-h-screen p-6 bg-surface text-primary">
      <div className="flex flex-col w-full items-center justify-center">

        <div className="auth-card">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center justify-center gap-8 py-8 px-6 sm:px-10"
            aria-label="Formulario de inicio de sesión"
          >
            <div className="flex flex-col items-center gap-3 text-center">
              <FaUserCircle size={90} className="text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-primary dark:text-white">Inicia sesión</h1>
                <p className="mt-2 text-sm text-muted dark:text-gray-300">
                  Accede a tu espacio de aprendizaje y descubre el contenido del sitio.
                </p>
              </div>
            </div>

            <section className="flex flex-col gap-5 w-full">
            <label htmlFor="username" className="sr-only">
              Username
            </label>

            <div className="flex items-center gap-3 rounded-3xl border-default bg-surface-2 px-4 py-1">
              <MdOutlinePerson size={22} className="text-primary flex-shrink-0" />
              <input {...register("username")} name="username" type="username" placeholder="Email" autoComplete="username" className="input-underline" />
            </div>

            <label htmlFor="password" className="sr-only">
              Contraseña
            </label>
            <div className="flex items-center gap-3 rounded-3xl border-default bg-surface-2 px-4 py-1">
              <MdLockOutline size={20} className="text-primary flex-shrink-0" />
              <input {...register("password")} name="password" type="password" placeholder="Contraseña" autoComplete="current-password" className="input-underline" />
            </div>
          </section>

          <div className="flex flex-col items-center text-md gap-3 w-full">
            <div className="w-full flex flex-col gap-3 text-sm sm:flex-row sm:justify-between">
              <Buttonav path="/register" className="text-primary hover:underline hover:text-primary-600 visited:text-muted">
                ¿No tienes cuenta?
              </Buttonav>

              <Buttonav path="/recuperar" className="text-primary hover:underline hover:text-primary-600 visited:text-muted">
                ¿Olvidaste tu contraseña?
              </Buttonav>
            </div>
          </div>

          <div className="w-full">
            <ButtonAction type="submit" color="primary" className="w-full btn-primary" aria-label="Iniciar sesión">
              Iniciar sesión
            </ButtonAction>
          </div>

          <ButtonAction type="button" color="primary" className="flex items-center gap-4 w-full btn-primary">
            <BsGoogle size={24} />
            Iniciar sesión con Google
          </ButtonAction>
        </form>
      </div>

      </div>
    </div>
  );
};

export default Login;
