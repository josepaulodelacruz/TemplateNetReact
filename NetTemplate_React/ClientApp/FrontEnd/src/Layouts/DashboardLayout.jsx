import { Outlet } from "react-router";
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar"
import { AppSidebar } from "~/components/ui/app-sidebar"

const DashboardLayout = () => {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main>
          <SidebarTrigger />
          <div className="p-4">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </>
  )
}

export default DashboardLayout;
