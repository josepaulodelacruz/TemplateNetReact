import React, { useState } from 'react'
import {
  UserIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  ChevronDown,
  ChevronUp,
  Users,
  Wrench,
} from 'lucide-react'
import useToggleDrawer from '~/Hooks/Sidenav/useToggleDrawer'
import { useLocation, useNavigate, NavLink } from 'react-router';
import StringRoutes from '~/Constants/StringRoutes';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/dropdown';
import {
  Drawer,
  DrawerContent,
  DrawerBody,
} from "@heroui/drawer"


const NavItemWithDropdown = ({
  hdrIcon = null,
  text = "",
  children
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isOpen } = useToggleDrawer();
  const stringRoutes = new StringRoutes();
  const { pathname } = useLocation()

  const toggleDropdown = () => {
    setDropdownOpen(state => !state);
  }

  return (
    <li className='flex flex-col py-1 '>
      <NavLink
        to={'#'}
        className={({ isActive }) =>
          `px-4 py-2 flex flex-row items-center text-gray-800 cursor-pointer ${stringRoutes.getRootRoute(pathname).includes(StringRoutes.settings) ? 'bg-gradient-to-r from-[#007a7e] to-[#00595c] text-white' : 'text-gray-600 hover:bg-[#00595c]/10'}`
        }
        onClick={toggleDropdown}
      >
        <span className="mr-3">
          {hdrIcon}
        </span>
        <span
          style={{
            transform: isOpen ? 'translateX(0px)' : 'translateX(-10px)',
            opacity: isOpen ? 1 : 0,
            transition: 'transform 0.3s ease, opacity 0.3s ease',
          }}
          className="text-sm"
        >
          {text}
        </span>

        <div className='flex justify-end flex-grow'>
          {dropdownOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </NavLink>
      <div
        style={{
          maxHeight: dropdownOpen ? "200px" : "0",
          overflow: "hidden",
          transition: "max-height 0.5s ease",
        }}
      >
        {isOpen && (
          <div className='pl-6 pt-2'>
            {children}
          </div>
        )}
      </div>
    </li>
  );
};

const NavItem = ({ icon, text, active = false, indented = false, url = "" }) => {
  const { isOpen } = useToggleDrawer();
  const { pathname } = useLocation();
  const stringRoutes = new StringRoutes();

  return (
    <li>
      <NavLink
        to={url}
        className={({ isActive }) =>
          `cursor-pointer flex items-center mx-2 px-2 py-2 rounded ${active ? 'bg-[#003B3D] text-white font-normal' : 'text-white font-normal hover:bg-[#00595c]'}`
        }
      >
        <span className="mr-3">{icon}</span>
        <span
          style={{
            transform: isOpen ? 'translateX(0px)' : 'translateX(-10px)',
            opacity: isOpen ? 1 : 0,
            transition: 'transform 0.3s ease, opacity 0.3s ease',
          }}
          className="text-sm">{text}</span>
      </NavLink>
    </li>
  )
}

const AdminNavItem = ({ onSetClearToken }) => {
  const { isOpen } = useToggleDrawer();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/')
    onSetClearToken();
  }

  const handleChangePassword = () => {
    navigate(StringRoutes.changePassword);
  }

  return (
    <Dropdown>
      <DropdownTrigger>
        <li className="flex flex-row items-center px-3">
          <span className='mr-2'>
            <UserIcon size={24} color="white" />
          </span>
          <div
            style={{
              transform: isOpen ? 'translateX(0px)' : 'translateX(-10px)',
              opacity: isOpen ? 1 : 0,
              transition: 'transform 0.3s ease, opacity 0.3s ease',
            }}
          >
            <div className="flex items-center">
              <span className="font-medium text-white">Super Amdin</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1 fill-white stroke-white"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            <p className="text-xs text-gray-200">Users</p>
          </div>
        </li>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem onPress={handleLogout} key="new">Logout</DropdownItem>
        <DropdownItem onPress={handleChangePassword}>Change Password</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}

const SidebarContent = ({ compactMode = false }) => {
  const { isOpen } = useToggleDrawer();
  const { pathname } = useLocation();
  const stringRoutes = new StringRoutes();

  // Force isOpen to true when in compact mode (for drawer view)
  const displayOpen = compactMode ? true : isOpen;

  return (
    <div className="bg-gradient-to-b from-[#00595c] to-[#003335] flex flex-col h-full text-white">
      <div className="p-4">
        <div className="flex items-center">
          <img
            src="https://placehold.co/40x40/ffffff/000000.png?text=PA"
            alt="Fortunewell Logo"
            className="mr-2"
          />
          <div
            style={{
              zIndex: displayOpen ? '1' : '-1',
              transform: displayOpen ? 'translateX(0px)' : 'translateX(-10px)',
              opacity: displayOpen ? 1 : 0,
              transition: 'transform 0.3s ease, opacity 0.3s ease',
            }}
          >
            <h1 className="text-lg font-bold text-white">PA ADMIN TEMPLATE</h1>
            <p className="text-xs text-gray-200">
              Default Template for PA systems using React/NET
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1">
        <ul>
          <AdminNavItem />
          <NavItem
            icon={<LayoutDashboardIcon size={18} color="white" />}
            text="Dashboard"
            url={StringRoutes.dashboard}
            active={stringRoutes.getRootRoute(pathname) === ''}
          />
          <NavItem
            icon={<SettingsIcon size={18} color="white" />}
            text="Settings"
            url={StringRoutes.settings}
            active={stringRoutes.getRootRoute(pathname) === 'settings'}
          />
          <NavItem
            icon={<Wrench size={18} color="white" />}
            text="Setup"
            url={StringRoutes.setup}
            active={stringRoutes.getRootRoute(pathname) === 'setup'}
          />
        </ul>

        <ul>
          <NavItemWithDropdown
            hdrIcon={<SettingsIcon size={18} color="white" />}
            text='Settings'
          >
            <NavLink
              to={StringRoutes.settings}
              className='flex items-center pt-1 hover:bg-[#00595c]/10'
            >
              <span className='mr-3'>
                <Users size={18} color="white" />
              </span>
              <span className='text-sm text-gray-200'>
                Users
              </span>
            </NavLink>
          </NavItemWithDropdown>

          <NavItemWithDropdown
            text="Setup"
            hdrIcon={<SettingsIcon color='white' size={18} />}>
            <NavLink
              to={StringRoutes.stationList}
              className='flex items-center py-2 hover:bg-[#00595c]/10'
            >
              <span className='mr-3'>
                <Users size={18} color="white" />
              </span>
              <span className='text-sm text-gray-200'>
                Stations
              </span>
            </NavLink>
            <NavLink
              to={StringRoutes.globalSetup}
              className='flex items-center py-2 hover:bg-[#00595c]/10'>
              <span className='mr-3'>
                <Users size={18} color="white" />
              </span>
              <span className='text-sm text-gray-200'>
                Global Records
              </span>
            </NavLink>
          </NavItemWithDropdown>
        </ul>
      </nav>
    </div>
  );
};

const Sidebar = ({ screenSize = "desktop", drawerSize = "md", onSetClearToken }) => {
  const { isOpen, toggleDrawer, isCompactSidebarOpen, onManageSidebarOpen } = useToggleDrawer();

  const shouldShowDrawer = screenSize === 'mobile' || screenSize === 'tablet';

  // For desktop view, show the regular sidebar
  if (!shouldShowDrawer) {
    return <SidebarContent />;
  }

  // For mobile and tablet view, show the drawer and toggle button
  return (
    <>
      <Drawer
        isOpen={isCompactSidebarOpen}
        onClose={onManageSidebarOpen}
        placement="left"
        size={drawerSize}
        radius="sm"
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerBody className="p-0">
                <SidebarContent compactMode={true} />
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Sidebar;
