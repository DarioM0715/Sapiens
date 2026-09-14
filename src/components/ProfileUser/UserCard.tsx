import type { User } from "@/types/system";
import type { Option } from "@/types/system";
import { useLocation } from "react-router-dom";
import { MoreOptionsDesktop } from "../Post/MoreOptionsDesktop";

//ICONS
import { MessageSquare, User as UserIcon, UserX, Flag, UserMinus, UserPlus } from "lucide-react";
import { Avatar } from "../Avatar";

export const UserCard = ({ user }: { user: User }) => {
  const { pathname } = useLocation();
  const { username, name, id, role } = user;

  const handleSelect = (option: Option) => {
    console.log(option);
  };

  const options = [
    { id: 1, label: "Enviar Mensaje", Icon: MessageSquare },
    { id: 2, label: "Dejar de seguir", Icon: UserMinus },
    { id: 3, label: "Seguir", Icon: UserPlus },
    { id: 4, label: "Ver perfil", Icon: UserIcon },
    { id: 5, label: "Bloquear", Icon: UserX },
    { id: 6, label: "Reportar", Icon: Flag },
  ];

  if (pathname !== "/user/following") {
    options.splice(1, 1);
  }

  if (pathname !== "/user/seguidores") {
    options.splice(2, 1);
  }

  return (
    <div className="flex items-center justify-between gap-3 p-4 border-b border-gray-200" key={id}>
      <div className="flex items-center gap-2">
        <Avatar user={user} size={12} />

        <div className="flex flex-col leading-tight">
          <h3 className="font-bold text-primary">{name}</h3>
          {username && <p className="text-sm text-gray-500">@{username}</p>}
          <div className="flex items-center gap-2 text-xs text-gray-400">
            {role && (
              <>
                <div className="bg-gray-400 rounded-full h-1 w-1" />
                <p>{role.name}</p>
              </>
            )}
          </div>
        </div>
      </div>

      <MoreOptionsDesktop options={options} onSelect={handleSelect} />
    </div>
  );
};
