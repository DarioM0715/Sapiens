import { Buttonav } from "@/shared/ui/Buttonnav";
import { Speaker, UserCheck, type LucideIcon, Settings } from "lucide-react";
import { AsidePost } from "../AsidePost";

type NotificationNav = {
  name: string;
  path: string;
  icon: LucideIcon;
};

export const Notifications = () => {
  const notificationsnavs: NotificationNav[] = [
    { name: "Publicaciones", path: "/notificaciones/publicaciones", icon: Speaker },
    { name: "Comentarios", path: "/notificaciones/comentarios", icon: UserCheck },
  ];

  return (
    <div className="flex justify-center gap-8 w-full py-5 px-5 lg:px-10 xl:px-20">
      <div className="w-ful max-w-[640px] flex-1 h-[150vh]">
        <div className="bg-surface-2 sticky top-24 border-default rounded-2xl shadow-sm ">
          <div className="bg-surface-2 border-b border-[var(--color-border)] px-4 rounded-t-2xl">
            <div className="h-16 flex items-center justify-between">
              <h2 id="navcard-heading" className="font-semibold text-lg text-primary">
                Notificaciones
              </h2>

              <Buttonav path="/settings/notificaciones" className="pr-2.5">
                <Settings size={20} className="text-primary" />
              </Buttonav>
            </div>
          </div>

          <nav className="flex flex-col divide-y divide-[var(--color-border)] rounded-md text-primary">
            {notificationsnavs.map(({ name, path, icon: Icon }) => (
              <Buttonav path={path} className="w-full p-5 flex items-center justify-between text-primary hover:bg-surface transition">
                <div className="flex gap-5 items-center">
                  <Icon size={20} className="text-primary" />
                  <span className="text-lg font-medium truncate">{name}</span>
                </div>

                <span className="rounded-full bg-blue-500 w-8 h-8 flex items-center justify-center font-bold">4</span>
              </Buttonav>
            ))}
          </nav>
        </div>
      </div>

      <AsidePost />
    </div>
  );
};

export default Notifications;
