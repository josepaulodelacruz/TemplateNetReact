import { create } from 'zustand' 

const useModuleItems = create((set) => ({
  modules: [],
  onSetModules: (items) => {

    set(() => ({modules: items}));
  }
}));

export default useModuleItems;
