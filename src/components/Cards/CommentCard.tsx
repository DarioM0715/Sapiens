import { timeAgo } from "@/shared/utils/utilsfunctions";
import { MoreOptions } from "../Post/MoreOptions";
import { NavLink, useNavigate } from "react-router-dom";

//INTERFACES
import type { Comment } from "@/types/system";
import type { Option } from "@/types/system";

// ICONS
import { Bookmark, Share2, Trash } from "lucide-react";
import { Stats } from "../Post/Stats";
import { Avatar } from "../Avatar";

export const CommentCard = ({ comment }: { comment: Comment }) => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const { id, time, user, content } = comment;
  const { name } = user;

  const options: Option[] = [
    { id: 1, label: "Guardar", Icon: Bookmark },
    { id: 2, label: "Compartir", Icon: Share2 },
    { id: 3, label: "Eliminar publicación", Icon: Trash },
  ];

  const handleSelect = (option: Option) => {
    console.log(option);
  };

  return (
    <article id={String(id)} className={"flex flex-col py-6 px-4 gap-3 border-default rounded-lg bg-surface"} aria-labelledby={`post-title-${id}`}>
      {/* HEADER */}
      <div className="flex text-primary justify-between items-center">
        <NavLink to="/otroperfil/:4">
          <div className="flex items-center gap-3">
            <Avatar user={user} size={12} />

            <div className="flex flex-col leading-tight">
              <h3 id={`post-title-${id}`} className="font-bold text-primary">
                {name}
              </h3>

              <div className="flex items-center gap-2 text-xs text-muted">
                <p>{timeAgo(time)}</p>
              </div>
            </div>
          </div>
        </NavLink>

        <MoreOptions options={options} onSelect={handleSelect} />
      </div>

      {/* BODY (clicable) */}
      <div onClick={() => handleNavigate("/comentarios")} role="button" tabIndex={0} className="flex flex-col gap-2 text-primary cursor-pointer">
        <p className="text-sm text-muted">{content}</p>
      </div>

      <Stats stats={comment} />
    </article>
  );
};
