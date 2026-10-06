import { useIsDesktop } from "@/shared/ui/useIsDesktop";
import { Buttonav } from "@/shared/ui/Buttonnav";
import { ScrollCard } from "../Cards/ScrollCard";
import { usePosts, useUserReplies, useSavedPosts, useLikedPosts } from "@/hooks/useContent";
import { useFollowUser, useUnfollowUser } from "@/hooks/useFollows";
import { useImageContrast } from "@/hooks/useImageContrast";

// INTERACES
import type { User } from "@/types/users";

// ICONS
import { Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Navs = ({ path, title, number }: { path: string; title: string; number: number | string }) => {
  return (
    <Buttonav path={path} className="p-3 py-2 flex items-center gap-2 bg-surface border-default rounded-xl hover-surface-2">
      <span className="text-sm text-primary">{title}</span>
      <span className="text-sm font-bold text-primary">{number}</span>
    </Buttonav>
  );
};

interface ProfileProps {
  user: User;
  isOwn: boolean;
}

export const Profile = ({ user, isOwn }: ProfileProps) => {
  const isDesktop = useIsDesktop(1024);
  const { background, name, note, avatar } = user;
  const isLightBackground = useImageContrast(background);

  const { categoria } = useParams();

  const isGuardados = categoria === "guardados";
  const isMeGusta = categoria === "me-gusta";
  const isComentarios = categoria === "comentarios";

  const postsQuery = usePosts(user.id, !isGuardados && !isMeGusta && !isComentarios);
  const repliesQuery = useUserReplies(isComentarios ? user.id : undefined);
  const savedQuery = useSavedPosts(isOwn && isGuardados);
  const likedQuery = useLikedPosts(isMeGusta ? user.id : undefined);

  const { data: posts = [] } = postsQuery;
  const { data: replies = [] } = repliesQuery;
  const { data: savedPosts = [] } = savedQuery;
  const { data: likedPosts = [] } = likedQuery;

  const activePosts = isGuardados ? savedPosts : isMeGusta ? likedPosts : isComentarios ? replies : posts;
  const activeLoading = isGuardados
    ? savedQuery.isLoading
    : isMeGusta
      ? likedQuery.isLoading
      : isComentarios
        ? repliesQuery.isLoading
        : postsQuery.isLoading;
  const activeNext = isGuardados
    ? savedQuery
    : isMeGusta
      ? likedQuery
      : isComentarios
        ? repliesQuery
        : postsQuery;

  const followMutation = useFollowUser();
  const unfollowMutation = useUnfollowUser();

  const [notice, setNotice] = useState<string | null>(null);

  const isFollowing = user.isFollowing ?? false;
  const isFollowPending = followMutation.isPending || unfollowMutation.isPending;

  const toggleFollow = () => {
    if (isFollowPending) return;
    if (isFollowing) {
      unfollowMutation.mutate(user.id);
    } else {
      followMutation.mutate(user.id);
    }
  };

  const profilenavs = [
    {
      path: `/user/${user.id}`,
      title: "Publicaciones",
      number: postsQuery.hasNextPage ? "+" : posts.length,
    },
    { path: `/user/${user.id}/following`, title: "Siguiendo", number: user.followingCount ?? 0 },
    { path: `/user/${user.id}/followers`, title: "Seguidores", number: user.followersCount ?? 0 },
  ];

  const infonavs = [
    { name: "Publicaciones", path: `/user/${user.id}` },
    ...(isOwn ? [{ name: "Guardados", path: `/user/${user.id}/guardados` }] : []),
    { name: "Me gusta", path: `/user/${user.id}/me-gusta` },
  ];

  useEffect(() => {
    if (!notice) return;
    const timeout = setTimeout(() => setNotice(null), 3000);
    return () => clearTimeout(timeout);
  }, [notice]);

  return (
    <section className="bg-surface min-h-screen w-full text-primary">
      {/* PROFILE INFO */}
      <div className="relative">
        <div className={isDesktop ? "ml-0" : ""}>
          <div className="w-full overflow-hidden">
            <img src={background} alt={`${name} background`} className="w-full h-44 md:h-56 object-cover" />
          </div>

          <div className="relative">
            <div className={"absolute flex flex-row left-11 transform -translate-y-1/2 -top-8 gap-10"}>
              <img src={avatar} alt={`${name} avatar`} className="w-32 h-32 rounded-full object-cover" />

              <div className="md:mt-8 mb-4 pl-0">
                <h2
                  className={`text-xl md:text-2xl font-semibold px-0 ${isLightBackground ? "text-gray-900" : "text-white"}`}
                  style={{ textShadow: isLightBackground ? "0 1px 3px rgba(255,255,255,0.7)" : "0 1px 3px rgba(0,0,0,0.7)" }}
                >
                  {name}
                </h2>
                {note && (
                  <p
                    className={`text-sm mt-1 ${isLightBackground ? "text-gray-700" : "text-gray-200"}`}
                    style={{ textShadow: isLightBackground ? "0 1px 3px rgba(255,255,255,0.7)" : "0 1px 3px rgba(0,0,0,0.7)" }}
                  >
                    {note}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between py-4 px-52 border-b border-[var(--color-border)] bg-surface-2">
              <div className="flex gap-2 ">
                {profilenavs.map((nav) => (
                  <Navs key={nav.title} {...nav} />
                ))}
              </div>

              <div className="relative flex gap-2 ">
                {isOwn ? (
                  <Buttonav path="/user/edit" className="flex items-center gap-2 px-6 py-2 rounded-xl bg-surface hover-surface-2 border-default transition">
                    <Edit size={18} className="text-primary" />
                    <span className="text-sm font-medium text-primary">Editar</span>
                  </Buttonav>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={toggleFollow}
                      disabled={isFollowPending}
                      className="flex items-center gap-2 px-6 py-2 rounded-xl bg-surface hover-surface-2 border-default transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <span className="text-sm font-medium ">{isFollowing ? "Siguiendo" : "Seguir"}</span>
                    </button>

                    {/* <div className="relative inline-block" onMouseEnter={() => handleMouseEnter("more")}>
                      <button className="flex items-center gap-2 px-6 py-2 rounded-xl bg-surface hover-surface-2 border-default transition">
                        <MoreHorizontal size={18} />
                      </button>
                      {openPanel === "more" && <PanelOptions title="Más" buttons={buttonsoptions} />}
                    </div> */}
                  </>
                )}

                {notice && (
                  <span className="absolute right-0 top-full mt-1 text-xs text-muted whitespace-nowrap">{notice}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ScrollCard
        posts={activePosts}
        navs={infonavs}
        isLoading={activeLoading}
        isEmpty={!activeLoading && activePosts.length === 0}
        hasNextPage={activeNext.hasNextPage}
        isFetchingNextPage={activeNext.isFetchingNextPage}
        onLoadMore={() => activeNext.fetchNextPage()}
      />
    </section>
  );
};
