import { Menu, AppShell, Burger, Chip, Paper, Group, ScrollArea, Space, Text } from '@mantine/core';
import { useDisclosure, useHeadroom } from '@mantine/hooks';
import { NavItems } from '~/components/NavItems';
import { NavLink, Outlet, useNavigate } from 'react-router';
import StringRoutes from '~/constants/StringRoutes';
import { BarChart, ChevronRight, HistoryIcon, LayoutDashboardIcon, LogOutIcon, WrenchIcon } from 'lucide-react';
import '../index.css';
import useAuth from '~/hooks/Auth/useAuth';
import { useEffect } from 'react';
import packageJson from '../../package.json';
import CrashReport from '~/components/Modal/CrashReport';

const DashboardLayout = () => {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const pinned = useHeadroom({ fixedAt: 120 })
  const { token, onSetClearToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token === null) {
      navigate(StringRoutes.login);
    }
  }, [token, navigate])

  const handleLogout = () => {
    onSetClearToken();
  }

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
          <Text size="lg" fw={700}>{packageJson.name}</Text>
          <Chip disabled={true}>
            {packageJson.version}
          </Chip>

        </Group>
      </AppShell.Header>
      <AppShell.Navbar >
        <ScrollArea h={'100%'}>
          <Space h={15} />
          <NavItems leftIcon={<LayoutDashboardIcon size={18} />} label="Dashboard" >
            <NavLink to={StringRoutes.dashboard}>Dashboard</NavLink>
          </NavItems>
          <NavItems leftIcon={<WrenchIcon size={18} />} label="Setup" >
            <NavLink to={StringRoutes.users}> Users </NavLink>
            <NavLink to={StringRoutes.modules}> Modules </NavLink>
          </NavItems>
          <NavItems leftIcon={<BarChart size={18}/>} label="Reports">
            <NavLink to={StringRoutes.report_crash}> Crash Reports </NavLink>
          </NavItems>
        </ScrollArea>
        <Menu position="top-end">
          <Menu.Target>
            <Paper style={{ cursor: 'pointer' }} radius="xs">
              <Group justify='space-between'>
                <Text>Default User</Text>
                <ChevronRight />
              </Group>
            </Paper>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item leftSection={<HistoryIcon />}>
              View History
            </Menu.Item>
            <Menu.Item onClick={handleLogout} leftSection={<LogOutIcon />}>
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />

        {
          //open crash report
          <CrashReport />
        }
      </AppShell.Main>
    </AppShell>
  );
}

export default DashboardLayout;
