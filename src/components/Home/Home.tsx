import { ScrollCard } from "../Cards/ScrollCard";
import { usePosts } from "@/hooks/useContent";

const Home = () => {
  const navs = [
    { name: "Inicio", path: "/home" },
    { name: "Siguiendo", path: "/following" },
  ];

  const { data: posts = [], isLoading, isError } = usePosts();

  return <ScrollCard posts={posts} navs={navs} isLoading={isLoading} isEmpty={!isLoading && !isError && posts.length === 0} />;
};

export default Home;