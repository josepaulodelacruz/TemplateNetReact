import { AppShell, Burger, Group, ScrollArea, Skeleton, Space, Text, useMantineTheme } from '@mantine/core';
import { useDisclosure, useHeadroom } from '@mantine/hooks';
import { Outlet } from 'react-router';
import { NavItems } from '~/components/NavItems';
import { NavLink } from 'react-router';
import StringRoutes from '~/constants/StringRoutes';
import { LayoutDashboardIcon, SettingsIcon } from 'lucide-react';

const DashboardLayout = () => {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const pinned = useHeadroom({ fixedAt: 120 })
  const theme = useMantineTheme();


  return (
    <AppShell
      header={{ height: 60, collapsed: !pinned }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
          <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
          <Text size="lg" fw={700}>Template Dashboard</Text>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar >
        <ScrollArea>
          <Space h={15}/>
          <NavItems leftIcon={<LayoutDashboardIcon />} label="Dashboard"/>
          <NavItems leftIcon={<SettingsIcon  />} label="Settings" >
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
