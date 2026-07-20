// INTERFACES
import type { Post, Comment } from "@/types/post";

// ICONS
import { Eye, MessageCircle, ThumbsUp, ThumbsDown, type LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Props = {
  post: Post | Comment;
};

type InteractButtonProps = {
  Icon: LucideIcon;
  value?: number;
  hovercolor?: string;
  onClick?: () => void;
  className?: string;
};

const InteractButton = ({ Icon, value, onClick, className }: InteractButtonProps) => {
  return (
    <button type="button" onClick={onClick} className={`rounded-md flex items-center gap-1 hover:bg-surface ${className}`}>
      <Icon size={18} className={`text-muted transform transition-all duration-150 hover:scale-125 hover:stroke-blue-400`} />
      <p className="text-sm">{value ?? 0}</p>
    </button>
  );
};

// COMPONENTE STATS
export const Stats = ({ post }: Props) => {
  const { views, messages, likes, dislikes, id } = post;
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="flex justify-between items-center pt-2">
      <div className="flex items-center gap-6 text-muted">
        <InteractButton Icon={Eye} value={views} />
        <InteractButton Icon={MessageCircle} value={messages} onClick={() => handleNavigate(`/detalles/${id}`)}/>
      </div>

      <div className="flex items-center gap-4 text-muted">
        <InteractButton Icon={ThumbsUp} value={likes} className="cursor-pointer"/>
        <InteractButton Icon={ThumbsDown} value={dislikes} className="cursor-pointer"/>
      </div>
    </div>
  );
};
