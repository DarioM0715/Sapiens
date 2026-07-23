import { ScrollCard } from "../Cards/ScrollCard";
import { examplePosts } from "@/mock/mockpublic";

const Home = () => {
  const navs = [
    { name: "Inicio", path: "/home" },
    { name: "Siguiendo", path: "/following" },
  ];

  return <ScrollCard posts={examplePosts} navs={navs} />;
};

export default Home;
