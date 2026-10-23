import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { ToggleTheme } from "@/shared/ui/ToggleTheme";

const SettingsSystem = () => {
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const listlink = [{ title: "settings de apariencia" }];

  return (
    <div className=" bg-primary text-primary">
      <ToggleTheme />
      <div className="flex flex-col">
        {listlink.map((link, key) => (
          <button onClick={handleOpen} key={key} className="flex items-center justify-between p-4">
            <p>{link.title}</p>

            <div className="flex items-center gap-2">
              <ChevronRight size={24} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SettingsSystem;
