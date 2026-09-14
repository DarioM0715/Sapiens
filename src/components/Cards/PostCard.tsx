import { timeAgo } from "@/shared/utils/utilsfunctions";
import { MoreOptionsDesktop } from "../Post/MoreOptionsDesktop";
import { useNavigate } from "react-router-dom";
import { Stats } from "../Post/Stats";
import { Avatar } from "../Avatar";

//INTERFACES
import type { Post } from "@/types/post";
import type { Option } from "@/types/system";

// ICONS
import { Bookmark, Share2, User } from "lucide-react";

const CategoryBubble = ({ category }: { category: string }) => {
  return (
    <div className="flex items-center gap-1 font-semibold rounded-xl px-2 py-0.5 text-xs bg-surface-2 border border-[var(--color-border)]">
      <span className="text-muted">#</span>
      <p className="text-primary">{category}</p>
    </div>
  );
};

export const PostCard = ({ post, className }: { post: Post, className?: string }) => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const { id, title, description, time, categories, user, institution, type } = post;
  const { name } = user;

  const options: Option[] = [
    { id: 1, label: "Denunciar"},
    { id: 2, label: "Bloquear usuario"},
    { id: 3, label: "Copiar enlace"},
    { id: 4, label: "Dejar de seguir"},
    { id: 5, label: "Guardar", Icon: Bookmark },
    { id: 6, label: "Compartir", Icon: Share2 },
    { id: 7, label: "Ver perfil", Icon: User },
  ];

  const handleSelect = (option: Option) => {
    console.log(option);
  };

  return (
    <article id={String(id)} className={`flex flex-col gap-3 p-4 md:p-6 ${className}`} aria-labelledby={`post-title-${id}`}>
      {/* HEADER */}
      <div className="flex text-primary justify-between items-center">
          <div className="flex items-center gap-3">
            <Avatar user={user} size={12} />

            <div className="flex flex-col leading-tight">
              <h3 id={`post-title-${id}`} className="font-bold text-primary">
                {name}
              </h3>

              {institution && <p className="text-sm text-muted">{institution}</p>}

              <div className="flex items-center gap-2 text-xs text-muted">
                <p>{timeAgo(time)}</p>
                {type && (
                  <>
                    <div className="bg-[var(--color-border)] rounded-full h-1 w-1" />
                    <p>{type}</p>
                  </>
                )}
              </div>
            </div>
          </div>

        <MoreOptionsDesktop options={options} onSelect={handleSelect} />
      </div>

      {/* BODY (clicable) */}
      <div onClick={() => handleNavigate(`/post/${id}`)} role="button" className="flex flex-col gap-2 text-primary cursor-pointer">
        <h3 className="font-bold text-lg flex items-center gap-2" id={`post-title-click-${id}`}>
          {title}
        </h3>
        <p className="text-sm text-muted">{description}</p>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">{(categories?.length ?? 0) > 0 && categories!.map((category) => <CategoryBubble key={category} category={category} />)}</div>
      </div>

      <Stats post={post} />
    </article>
  );
};
