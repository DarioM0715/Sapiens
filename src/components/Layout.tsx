import { Outlet } from "react-router-dom";
import { useIsDesktop } from "@/shared/ui/useIsDesktop";
import { MainHeader } from "./Headers/MainHeader";
import { MobileHeader } from "./Headers/MobileHeader";
import { ScrollToTop } from "./ScrollToTop";
import { Footer } from "./Footers/Footer";

const Layout = ({ sidebarBreakpoint = 1024 }) => {
  const isDesktop = useIsDesktop(sidebarBreakpoint);

  return (
    // <div id="principalgrid" className="bg-surface grid min-h-dvw">
    <div className="bg-surface">
      <ScrollToTop />
      {isDesktop ? <MainHeader /> : <MobileHeader />}

      <main className="flex items-center justify-center bg-surface">
        <Outlet />
      </main>
      {!isDesktop && <Footer/>}
    </div>
  );
};

export default Layout;