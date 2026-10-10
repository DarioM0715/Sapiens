import { Buttonav } from "@/shared/ui/Buttonnav";
import { ChevronRight } from "lucide-react";

const SettingsAccount = () => {
  const listlink = [
    { title: "Cambiar contraseña", link: "/settings/cuenta/contraseña" },
    { title: "Eliminar cuenta", link: "/settings/cuenta/eliminar" },
  ];

  return (
    <div className=" bg-primary   text-white">
      <div className="flex flex-col">
        {listlink.map((link, key) => (
          <Buttonav link={link.link} key={key} className="flex items-center justify-between p-4">
            <p>{link.title}</p>

            <div className="flex items-center gap-2">
              <ChevronRight size={24} />
            </div>
          </Buttonav>
        ))}
      </div>
    </div>
  );
};

export default SettingsAccount;
