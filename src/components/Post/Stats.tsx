// INTERFACES
import type { Post } from "@/types/post";

// ICONS
import { Eye, MessageCircle, ThumbsUp, ThumbsDown, type LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLikePost, useDislikePost } from "@/hooks/useContent";

type Props = {
  post: Post;
};

type InteractButtonProps = {
  Icon: LucideIcon;
  value?: number;
  onClick?: () => void;
  disabled?: boolean;
};

const InteractButton = ({ Icon, value, onClick, disabled }: InteractButtonProps) => {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`rounded-md flex items-center gap-1 hover:bg-surface ${disabled ? "cursor-default" : "cursor-pointer"}`}>
      <Icon size={18} className={`text-muted transform transition-all duration-150 hover:scale-125 hover:stroke-blue-400`} />
      <p className="text-sm">{value ?? 0}</p>
    </button>
  );
};

// COMPONENTE STATS
export const Stats = ({ post }: Props) => {
  const { views, messages, likes, dislikes, id } = post;
  const navigate = useNavigate();

  const likeMutation = useLikePost();
  const dislikeMutation = useDislikePost();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="flex justify-between items-center pt-2">
      <div className="flex items-center gap-6 text-muted">
        <InteractButton Icon={Eye} value={views} />
        <InteractButton Icon={MessageCircle} value={messages} onClick={() => handleNavigate(`/post/${id}`)} />
      </div>

      <div className="flex items-center gap-4 text-muted">
        <InteractButton Icon={ThumbsUp} value={likes} onClick={() => likeMutation.mutate(id)} disabled={likeMutation.isPending} />
        <InteractButton Icon={ThumbsDown} value={dislikes} onClick={() => dislikeMutation.mutate(id)} disabled={dislikeMutation.isPending} />
      </div>
    </div>
  );
};