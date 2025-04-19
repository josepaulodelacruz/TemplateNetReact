import { create } from 'zustand';

const useToggleDrawer = create((set, get) => ({
  screenSizes: "desktop",
  isOpen: true, //default state of the drawer is always open,
  isCompactSidebarOpen: true,
  isToggled: () => {
    const _isOpen = get().isOpen;
    set({isOpen: !_isOpen})
  },
  onManageSidebarOpen: () => {
    set((state) => ({isCompactSidebarOpen: !state.isCompactSidebarOpen}))
  },
  onManageScreenSize: (item) => {
    set({ screenSizes: item })
  }

}))

export default useToggleDrawer;
