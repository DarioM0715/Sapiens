import { ScrollCard } from "../Cards/ScrollCard";
import { usePosts } from "@/hooks/useContent";

const Community = () => {
  const navs = [
    { name: "Comunidad", path: "/community" },
    { name: "Recientes", path: "/community" },
  ];

  const { data: posts = [], isLoading, isError } = usePosts();

  return <ScrollCard posts={posts} navs={navs} isLoading={isLoading} isEmpty={!isLoading && !isError && posts.length === 0} />;
};

export default Community;