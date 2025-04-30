import { createBrowserRouter, RouterProvider } from "react-router";
import StringRoutes from '~/constants/StringRoutes';
import DashboardLayout from "~/layouts/DasboardLayout";
import Setup from "~/pages/Setup";

const DASHBOARD_ROUTES = [

  { index: true, element: <div>Dashboard </div> },
  { 
    path: StringRoutes.setup, 
    Component: Setup,
    children: [
      { path: StringRoutes.users, element: <div>Users</div>},
      { path: StringRoutes.modules, element: <div>Modules</div>}
    ]
    
  },
]

const router = createBrowserRouter([
  {
    path: StringRoutes.dashboard,
    Component: DashboardLayout,
    children: DASHBOARD_ROUTES
  }
])

export default function Router() {
  return <RouterProvider router={router}/>
}
