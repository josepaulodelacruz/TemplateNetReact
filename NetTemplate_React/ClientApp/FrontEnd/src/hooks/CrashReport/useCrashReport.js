import { create } from 'zustand';

const useCrashReport = create((set) => ({
  isCrashReportModal: false,
  errorDetails: {
    when: "",
    where: "",
    what: "",
    stackTrace: "",
    userAgent: "",
    email: "",
    severityLevel: "",
    details: "",
    scenario: "",
    error: {},
  },
  onOpenCrashReportModal: () => set({ isCrashReportModal: true }),
  onCloseCrashReportModal: () => set({ isCrashReportModal: false }),
  onTriggerCrashReportModal: ({
    error,
    pathname,
    what = "",
    userAgent = null
  }) => {
    const now = new Date();
    const isoWithoutMillis = now.toISOString().split('.')[0] + 'Z';

    const _errorDetails = {
      when: isoWithoutMillis,
      where: pathname,
      what: `${error.name}: ${error.message}`,
      stackTrace: error.stack,
      userAgent: userAgent,
      error: error,
    }
    set((state) => ({ 
      isCrashReportModal: !state.isCrashReportModal, 
      errorDetails: {
        ...state.errorDetails,
        ..._errorDetails
      } 
    }))
  },
}));

export default useCrashReport;
