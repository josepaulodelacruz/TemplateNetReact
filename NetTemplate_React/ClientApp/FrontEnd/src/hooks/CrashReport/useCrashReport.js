import { create } from 'zustand';

const useCrashReport = create((set) => ({
  isCrashReportModal: true,
  onOpenCrashReportModal: () => set({ isCrashReportModal: true }),
  onCloseCrashReportModal: () => set({ isCrashReportModal: false }),
  onTriggerCrashReportModal: () => {
    set((state) => ({ isCrashReportModal: !state.isCrashReportModal}))
  }
}));

export default useCrashReport;
