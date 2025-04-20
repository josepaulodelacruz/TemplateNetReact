import { NavLink, Outlet, useLocation } from "react-router";
import Navbar from "~/Components/Navbar";
import NavbarTabs from "~/Components/NavbarTabs";
import StringRoutes from "~/Constants/StringRoutes";


const Settings = () => {
  const stringRoutes = new StringRoutes();
  const { pathname } = useLocation();

  return (
    <div className="">
      <Navbar
        title="Settings" >
        <NavbarTabs >
          <NavLink
            to={StringRoutes.settings} // Ensure this points to the "settings" route
            end // This makes sure it's active only for the exact "settings" route
            className={({ isActive }) =>
              isActive
                ? "border-b-2 pb-3 border-main font-normal text-main"
                : "text-gray-500 pb-3"
            }
          >
            Settings
          </NavLink>
          <NavLink
            to={'permissions'} // Points to "settings/permissions"
            className={({ isActive }) =>
              stringRoutes.getCurrentSubRoute(pathname).includes(StringRoutes.permission)
                ? "border-b-2 pb-3 border-primary font-normal text-primary"
                : "text-gray-500 pb-3"
            }
          >
            Account
          </NavLink>
        </NavbarTabs>
      </Navbar>
      <Outlet />
    </div>

  )
}

export default Settings;
