//HOOKS
import { useNavigate } from "react-router-dom";

//TYPES
import type { User } from "@/types/users";
import { avatarOrDefault } from "@/shared/utils/userMedia";

const SIZES: Record<number, string> = {
  8: "w-8 h-8",
  9: "w-9 h-9",
  10: "w-10 h-10",
  12: "w-12 h-12",
};

export const Avatar = ({ user, size = 10 }: { user: User | null; size?: number }) => {
  const navigate = useNavigate();
  const name = user?.name ?? "";
  const avatar = avatarOrDefault(user?.avatar);
  const id = user?.id ?? "";
  const sizeClass = SIZES[size] ?? SIZES[10];

  const handleNavigate = () => {
    navigate(`/user/${id}`)
  }

  return (
    <img src={avatar} alt={name} onClick={handleNavigate} className={`rounded-full object-cover cursor-pointer ${sizeClass}`} />
  );
};