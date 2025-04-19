import { createBrowserRouter } from 'react-router'
import InitialPage from '~/Pages/InitialPage'
import StringRoutes from '~/Constants/StringRoutes'
import LoginPage from '~/Pages/Auth/LoginPage'
import DashboardLayout from './Layouts/DashboardLayout'

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
    path: '/dashboard',
    Component: DashboardLayout,
    children: [
      { index: true, element: <div>Dashboard </div>}
    ]
  }
])

export default Router
