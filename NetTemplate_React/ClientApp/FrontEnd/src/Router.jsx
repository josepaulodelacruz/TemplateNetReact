import { createBrowserRouter, RouterProvider } from "react-router";
import StringRoutes from '~/constants/StringRoutes';
import DashboardLayout from "~/layouts/DasboardLayout";

//Setup
import Setup from "~/pages/Setup";
import User from "./sub_pages/Setup/User";

const DASHBOARD_ROUTES = [

  { index: true, element: <div>Dashboard </div> },
  { 
    path: StringRoutes.setup, 
    Component: Setup,
    children: [
      { path: StringRoutes.users, Component: User},
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
