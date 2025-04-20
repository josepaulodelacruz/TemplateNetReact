import { createBrowserRouter } from 'react-router'
import InitialPage from '~/Pages/InitialPage'
import StringRoutes from '~/Constants/StringRoutes'
import LoginPage from '~/Pages/Auth/LoginPage'
import DashboardLayout from './Layouts/DashboardLayout'
import Settings from './Pages/Settings'

const DASHBOARD_ROUTES = [
  { index: true, element: <div>Dashboard </div> },
  { path: 'settings', Component: Settings }
]

const Router = createBrowserRouter([
  {
    path: StringRoutes.initial,
    Component: InitialPage
  },
  {
    path: StringRoutes.test,
    Component: <div>Test</div>
  },
  {
    path: StringRoutes.login,
    Component: LoginPage
  },
  {
    path: StringRoutes.dashboard,
    Component: DashboardLayout,
    children: DASHBOARD_ROUTES
  }
])

export default Router
