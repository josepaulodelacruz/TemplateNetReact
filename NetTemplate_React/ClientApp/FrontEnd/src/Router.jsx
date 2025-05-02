import { createBrowserRouter, RouterProvider } from "react-router";
import StringRoutes from '~/constants/StringRoutes';
import DashboardLayout from "~/layouts/DasboardLayout";

//Setup
import Setup from "~/pages/Setup";
import User from "~/sub_pages/Setup/User";
import Modules from "~/sub_pages/Setup/Modules";
import ModulesInitialPage from "~/sub_pages/Setup/ModulesInitialPage.jsx";
import ModulesFormPage from "~/sub_pages/Setup/ModulesFormPage";
import { Component } from "lucide-react";
import Login from "./pages/Auth/Login";

const DASHBOARD_ROUTES = [

  { index: true, element: <div>Dashboard </div> },
  {
    path: StringRoutes.setup,
    Component: Setup,
    children: [
      { path: StringRoutes.users, Component: User },
      {
        path: StringRoutes.modules,
        Component: Modules,
        children: [
          { index: true, Component: ModulesInitialPage },
          { path: StringRoutes.modules_form, Component: ModulesFormPage },
        ]
      }
    ]

  },
]

const router = createBrowserRouter([
  {
    path: StringRoutes.dashboard,
    Component: DashboardLayout,
    children: DASHBOARD_ROUTES
  },
  {
    path: StringRoutes.login,
    Component: Login,
  }
])

export default function Router() {
  return <RouterProvider router={router} />
}
