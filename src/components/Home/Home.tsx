import { ScrollCard } from "../Cards/ScrollCard";
import { usePosts, useFollowingPosts } from "@/hooks/useContent";
import { useLocation } from "react-router-dom";

const Home = () => {
  const navs = [
    { name: "Inicio", path: "/home" },
    { name: "Siguiendo", path: "/home/following" },
  ];

  const { pathname } = useLocation();
  const isFollowingFeed = pathname.endsWith("/home/following");

  const homeQuery = usePosts();
  const followingQuery = useFollowingPosts(isFollowingFeed);

  const { data: posts = [], isLoading, isError } = isFollowingFeed ? followingQuery : homeQuery;

  return <ScrollCard posts={posts} navs={navs} isLoading={isLoading} isEmpty={!isLoading && !isError && posts.length === 0} />;
};

export default Home;