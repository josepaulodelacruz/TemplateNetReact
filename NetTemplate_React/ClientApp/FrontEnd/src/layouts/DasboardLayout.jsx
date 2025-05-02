import { AppShell, Burger, Group, ScrollArea, Space, Text } from '@mantine/core';
import { useDisclosure, useHeadroom } from '@mantine/hooks';
import { NavItems } from '~/components/NavItems';
import { NavLink, useOutlet, useLocation, Outlet } from 'react-router';
import StringRoutes from '~/constants/StringRoutes';
import { LayoutDashboardIcon, WrenchIcon } from 'lucide-react';
// import { SwitchTransition, CSSTransition } from 'react-transition-group';
import { useRef } from 'react';
import '../index.css';

const DashboardLayout = () => {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const pinned = useHeadroom({ fixedAt: 120 })
  // const currentOutlet = useOutlet();
  // const location = useLocation();
  // const ref = useRef(null);

  return (
    <AppShell
      header={{ height: 60, collapsed: !pinned, offset: true }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
    >
      <AppShell.Header >
        <Group h="100%" px="md" >
          <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
          <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
          <Text size="lg" fw={700}>Template Dashboard</Text>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar >
        <ScrollArea>
          <Space h={15} />
          <NavItems leftIcon={<LayoutDashboardIcon size={18} />} label="Dashboard" >
            <NavLink to={StringRoutes.dashboard}>Dashboard</NavLink>
          </NavItems>
          <NavItems leftIcon={<WrenchIcon size={18} />} label="Setup" >
            <NavLink to={StringRoutes.users}> Users </NavLink>
            <NavLink to={StringRoutes.modules}> Modules </NavLink>
          </NavItems>

        </ScrollArea>
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}

export default DashboardLayout;
