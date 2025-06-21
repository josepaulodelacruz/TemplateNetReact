import { create } from 'zustand' 

const useModuleItems = create((set) => ({
  modules: [],
  filterModules: [],
  onSetFilterModules: (items) => {
    set(() => ({filterModules: items}));
  },
  onSetModules: (items) => {
    set(() => ({modules: items}));
  }
}));

export default useModuleItems;
