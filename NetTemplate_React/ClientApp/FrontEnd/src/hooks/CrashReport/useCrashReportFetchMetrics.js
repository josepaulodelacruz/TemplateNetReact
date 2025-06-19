import { useQuery } from "@tanstack/react-query";
import client from "~/config/client";
import QueryKeys from "~/constants/QueryKeys";

const useCrashReportFetchMetrics = (filterDate = 'MONTH') => {
  return useQuery({
    queryKey: [QueryKeys.REPORTS_CRASH_METRICS, filterDate],
    queryFn: async () => {
      const response = await client.get(`/Reports/CrashReport/metrics?filterDate=${filterDate}`);
      return response.data;
    }
  });
}

export default useCrashReportFetchMetrics;
