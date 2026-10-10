import { useParams } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import { useUser } from "@/hooks/useUsers";
import { Profile } from "./Profile";

const CATEGORY_SLUGS = new Set(["publicaciones", "comentarios", "guardados", "me-gusta", "siguiendo"]);

export const PageProfile = () => {
  const { id } = useParams();
  const { user: authUser, isLoadingAuth } = useAuthContext();

  const targetId = (id && !CATEGORY_SLUGS.has(id) ? id : undefined) ?? authUser?.id;
  const isOwn = !!authUser && !!targetId && String(authUser.id) === String(targetId);

  const { data: fetchedUser, isLoading, isError } = useUser(targetId);

  if (isLoadingAuth) {
    return <p className="py-20 text-center text-muted">Cargando perfil...</p>;
  }

  const profileUser = fetchedUser ?? (isOwn ? authUser : undefined);

  if (!profileUser) {
    if (isLoading) {
      return <p className="py-20 text-center text-muted">Cargando perfil...</p>;
    }
    return <p className="py-20 text-center text-muted">{isError ? "Usuario no encontrado." : "Inicia sesión para ver tu perfil."}</p>;
  }

  return <Profile user={profileUser} isOwn={isOwn} />;
};

export default PageProfile;
