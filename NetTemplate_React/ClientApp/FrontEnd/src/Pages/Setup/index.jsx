import { NavLink, Outlet } from "react-router";
import Navbar from "~/Components/Navbar";
import NavbarTabs from "~/Components/NavbarTabs";
import StringRoutes from "~/Constants/StringRoutes";


const Setup = () => {
  return (
    <div>
      <Navbar title="Setup" >
        <NavbarTabs>
          <NavLink
            to={StringRoutes.users}
            end
            className={({ isActive }) =>
              isActive
                ? "border-b-2 pb-3 border-main font-normal text-main"
                : "text-gray-500 pb-3"
            }
          >
            Users
          </NavLink>
          <NavLink
            to={StringRoutes.modules}
            end
            className={({ isActive }) =>
              isActive
                ? "border-b-2 pb-3 border-main font-normal text-main"
                : "text-gray-500 pb-3"
            }
          >
            Modules
          </NavLink>

        </NavbarTabs>
      </Navbar>
      <Outlet />
    </div>
  )
}

export default Setup;
