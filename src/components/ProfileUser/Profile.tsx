import { useIsDesktop } from "@/shared/ui/useIsDesktop";
import { Buttonav } from "@/shared/ui/Buttonnav";
import { ScrollCard } from "../Cards/ScrollCard";
import { examplePosts } from "@/mock/mockpublic";

// INTERACES
import type { User } from "@/types/system";

// ICONS
import { Edit, Flag, MoreHorizontal, UserLock } from "lucide-react";
import { PanelOptions } from "../Headers/PanelOptions";
import { useEffect, useRef, useState } from "react";

const Navs = ({ path, title, number }: { path: string; title: string; number: number }) => {
  return (
    <Buttonav path={path} className="p-3 py-2 flex items-center gap-2 bg-surface-2 border-default rounded-xl hover-surface-2">
      <span className="text-sm text-primary">{title}</span>
      <span className="text-sm font-bold text-primary">{number}</span>
    </Buttonav>
  );
};

export const Profile = ({ user, type }: { user: User; type: boolean }) => {
  const isDesktop = useIsDesktop(1024);
  const { background, name, note, avatar } = user;

  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const rightActionsRef = useRef<HTMLDivElement | null>(null);

  const profilenavs = [
    { path: "/", title: "Publicaciones", number: 1 },
    { path: "/user/following", title: "Siguiendo", number: 20 },
    { path: "/user/seguidores", title: "Seguidores", number: 20 },
    { path: "/user/me-gusta", title: "Me gusta", number: 10 },
  ];

  const infonavs = [
    { name: "Publicaciones", path: "/user/publicaciones" },
    { name: "Comentarios", path: "/user/comentarios" },
    { name: "Guardados", path: "/user/guardados" },
    { name: "Me gusta", path: "/user/me-gusta" },
  ];

  const handleMouseEnter = (panel: string) => {
    setOpenPanel(panel);
  };

  const handleMouseLeave = () => {
    setOpenPanel(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (rightActionsRef.current && !rightActionsRef.current.contains(event.target as Node)) {
        handleMouseLeave();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const buttonsoptions = [
    { name: "Denunciar usuario", path: "/user/321", icon: Flag },
    { name: "Bloquear usuario", path: "/user/321", icon: UserLock },
  ];

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
              <img src={avatar} className="w-32 h-32 rounded-full object-cover" />

              <div className="md:mt-8 mb-4 pl-0">
                <h2 className="text-xl md:text-2xl font-semibold text-white px-0">{name}</h2>
                {note && <p className="text-sm mt-1 text-gray-300">{note}</p>}
              </div>
            </div>

            <div className="flex items-center justify-between py-4 px-52 border-b border-[var(--color-border)] bg-surface-2">
              <div className="flex gap-2 ">
                {profilenavs.map((nav) => (
                  <Navs key={nav.path} {...nav} />
                ))}
              </div>

              <div className="flex gap-2 " ref={rightActionsRef}>
                {type ? (
                  <Buttonav path="/user/editar" className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-2 border-default transition">
                    <Edit size={18} className="text-primary" />
                    <span className="text-sm font-medium text-primary">Editar</span>
                  </Buttonav>
                ) : (
                  <>
                    <div className="relative inline-block" onMouseEnter={() => handleMouseEnter("more")}>
                      <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-2 border-default transition">
                        <MoreHorizontal size={18} />
                      </button>
                      {openPanel === "more" && <PanelOptions title="Más" buttons={buttonsoptions} />}
                    </div>

                    <div className="inline-block" onMouseEnter={() => handleMouseEnter("follow")}>
                      <Buttonav path="/user/editar" className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-2 border-default transition">
                        <span className="text-sm font-medium ">Seguir</span>
                      </Buttonav>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ScrollCard posts={examplePosts} navs={infonavs} />
    </section>
  );
};
