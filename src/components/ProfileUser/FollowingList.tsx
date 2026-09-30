import { useParams } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import { useFollowing } from "@/hooks/useFollows";
import FollowList from "./FollowList";

const FollowingList = () => {
  const { id } = useParams();
  const { user } = useAuthContext();
  const targetId = id ?? user?.id;
  const isOwn = !!user && String(user.id) === String(targetId);

  const { data: users = [], isLoading } = useFollowing(targetId);

  const navs = [{ name: "Siguiendo", path: targetId ? `/user/${targetId}/following` : "/user/following" }];
  const messages = [
    "Actualmente no sigues a nadie",
    "Este usuario actualmente no sigue a nadie",
  ]

  return (
    <FollowList users={users} isLoading={isLoading} navs={navs} isOwn={isOwn} messages={messages}/>
  );
};

export default FollowingList;
 