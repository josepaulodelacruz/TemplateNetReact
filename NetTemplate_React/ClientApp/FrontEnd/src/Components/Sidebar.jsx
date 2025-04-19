import React, { useState } from 'react'
import {
  UserIcon,
  LayoutDashboardIcon,
  FileTextIcon,
  FuelIcon,
  WrenchIcon,
  PackageIcon,
  SettingsIcon,
  ChevronDown,
  ChevronUp,
  Users,
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
          `px-4 py-2 flex flex-row items-center text-gray-800 cursor-pointer ${stringRoutes.getRootRoute(pathname).includes(StringRoutes.settings) ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-blue-50'}`
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

  return (
    <li>
      <NavLink
        to={url}
        className={({ isActive }) =>
          `cursor-pointer flex items-center px-4 py-2 ${isActive ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-blue-50'}`
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

const AdminNavItem = () => {
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
            <UserIcon size={24} />
          </span>
          <div
            style={{
              transform: isOpen ? 'translateX(0px)' : 'translateX(-10px)',
              opacity: isOpen ? 1 : 0,
              transition: 'transform 0.3s ease, opacity 0.3s ease',
            }}
          >
            <div className="flex items-center">
              <span className="font-medium text-gray-700">Super Amdin</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                fill="none"
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
            <p className="text-xs text-gray-600">Users</p>
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
  const { isOpen, toggleDrawer } = useToggleDrawer();

  // Force isOpen to true when in compact mode (for drawer view)
  const displayOpen = compactMode ? true : isOpen;

  return (
    <div className="bg-blue-50 flex flex-col h-full">
      <div className="p-4">
        <div className="flex items-center">
          <img
            src="https://placehold.co/40x40/FFB000/000000.png?text=F"
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
            <h1 className="text-lg font-bold text-blue-900">Fortunewell</h1>
            <p className="text-xs text-gray-600">
              Integrated Fuel Management System
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1">
        <ul>
          <AdminNavItem />
          <NavItem
            icon={<LayoutDashboardIcon size={18} />}
            text="Dashboard"
            url={StringRoutes.dashboard}
          />
          <NavItem
            icon={<FileTextIcon size={18} />}
            text="Sales Transactions"
            url={StringRoutes.salesTransactions}
          />
          <NavItem
            icon={<FuelIcon size={18} />}
            text="Fuel Management"
            url={StringRoutes.fuelManagement}
          />
          <NavItem
            icon={<WrenchIcon size={18} />}
            text="Service Management"
            url={StringRoutes.serviceManagement}
          />
          <NavItem
            icon={<PackageIcon size={18} />}
            text="Inventory Management"
            url={StringRoutes.inventoryManagement}
          />
        </ul>

        <ul>
          <NavItemWithDropdown
            hdrIcon={<SettingsIcon size={18} />}
            text='Settings'
          >
            <NavLink
              to={StringRoutes.settings}
              className='flex items-center pt-1 '>
              <span className='mr-3'>
                <Users size={18} />
              </span>
              <span className='text-sm text-default-600'>
                Users
              </span>
            </NavLink>
          </NavItemWithDropdown>

          <NavItemWithDropdown
            text="Setup"
            hdrIcon={<SettingsIcon color='black' size={18} />}>
            <NavLink
              to={StringRoutes.stationList}
              className='flex items-center py-2 '>
              <span className='mr-3'>
                <Users size={18} />
              </span>
              <span className='text-sm text-default-600'>
                Stations
              </span>
            </NavLink>
            <NavLink
              to={StringRoutes.globalSetup}
              className='flex items-center py-2'>
              <span className='mr-3'>
                <Users size={18} />
              </span>
              <span className='text-sm text-default-600'>
                Global Records
              </span>
            </NavLink>
          </NavItemWithDropdown>

        </ul>
      </nav>
    </div>
  );
};

const Sidebar = ({ screenSize = "desktop", drawerSize = "md" }) => {
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
