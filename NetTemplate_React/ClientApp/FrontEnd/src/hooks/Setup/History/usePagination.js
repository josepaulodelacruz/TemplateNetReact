import { create } from 'zustand'

const usePagination = create((set) => ({
  page: 1,
  totalPages: 1,
  totalCount: 10,
  onSetPage: (page) => set({ page: page }),
  onSetTotalPage: (totalPage) => set({ totalPages: totalPage })
}));

export default usePagination; 
