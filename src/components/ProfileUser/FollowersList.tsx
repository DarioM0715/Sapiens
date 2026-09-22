import { useParams } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import { useFollowers } from "@/hooks/useFollows";
import FollowList from "./FollowList";

const FollowersList = () => {
  const { id } = useParams();
  const { user } = useAuthContext();
  const targetId = id ?? user?.id;
  const isOwn = !!user && String(user.id) === String(targetId);

  const { data: users = [], isLoading } = useFollowers(targetId);
  
  const navs = [{ name: "Seguidores", path: targetId ? `/user/${targetId}/followers` : "//user/followers"}];
  const messages = [
    "Actualmente no tienes seguidores",
    "Este usuario actualmente no tiene seguidores",
  ]

  return (
    <FollowList users={users} isLoading={isLoading} navs={navs} isOwn={isOwn} messages={messages}/>
  );
};

export default FollowersList;
