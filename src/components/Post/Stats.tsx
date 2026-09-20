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
  active?: boolean;
  activeClass?: string;
};

const InteractButton = ({ Icon, value, onClick, disabled, active, activeClass }: InteractButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={active ? "Quitar reacción" : "Dar reacción"}
      className={`rounded-md flex items-center gap-1 hover:bg-surface ${disabled ? "cursor-default opacity-60" : "cursor-pointer"}`}
    >
      <Icon
        size={18}
        fill={active ? "currentColor" : "none"}
        className={`transform transition-all duration-150 hover:scale-125 ${active ? activeClass : "text-muted hover:stroke-blue-400"}`}
      />
      <p className="text-sm">{value ?? 0}</p>
    </button>
  );
};

// COMPONENTE STATS
export const Stats = ({ post }: Props) => {
  const { views, messages, likes, dislikes, id, hasLiked, hasDisliked } = post;
  const navigate = useNavigate();

  const likeMutation = useLikePost();
  const dislikeMutation = useDislikePost();

  const reactionPending = likeMutation.isPending || dislikeMutation.isPending;

  return (
    <div className="flex justify-between items-center pt-2">
      <div className="flex items-center gap-6 text-muted">
        <InteractButton Icon={Eye} value={views} />
        <InteractButton Icon={MessageCircle} value={messages} onClick={() => navigate(`/post/${id}`)} />
      </div>

      <div className="flex items-center gap-4 text-muted">
        <InteractButton
          Icon={ThumbsUp}
          value={likes}
          active={hasLiked}
          activeClass="text-blue-500"
          onClick={() => likeMutation.mutate(id)}
          disabled={reactionPending}
        />
        <InteractButton
          Icon={ThumbsDown}
          value={dislikes}
          active={hasDisliked}
          activeClass="text-red-500"
          onClick={() => dislikeMutation.mutate(id)}
          disabled={reactionPending}
        />
      </div>
    </div>
  );
};