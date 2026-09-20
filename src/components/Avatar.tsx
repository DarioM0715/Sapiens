//HOOKS
import { useNavigate } from "react-router-dom";

//TYPES
import type { User } from "@/types/users";

export const Avatar = ({ user, size = 10 }: { user: User | null; size?: number }) => {
  const navigate = useNavigate();
  const name = user?.name ?? "";
  const avatar = user?.avatar ?? "";
  const id = user?.id ?? "";

  const handleNavigate = () => {
    navigate(`/user/${id}`)
  }

  return avatar ? (
    <img src={avatar} alt={name} onClick={handleNavigate} className={`rounded-full object-cover cursor-pointer w-${size} h-${size}`} />
  ) : (
    <div onClick={handleNavigate} className={`rounded-full cursor-pointer bg-gray-300 flex items-center justify-center font-semibold text-sm select-none w-10 h-10`} aria-hidden>
      <img alt={""} className={`rounded-full object-cover w-${size} h-${size}`} />
    </div>
  );
};