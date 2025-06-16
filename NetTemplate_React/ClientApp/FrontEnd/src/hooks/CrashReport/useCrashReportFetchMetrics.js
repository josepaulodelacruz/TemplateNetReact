import { useQuery } from "@tanstack/react-query";
import client from "~/config/client";
import QueryKeys from "~/constants/QueryKeys";

const useCrashReportFetchMetrics = () => {
  return useQuery({
    queryKey: [QueryKeys.REPORTS_CRASH_METRICS],
    queryFn: async () => {
      const response = await client.get("/Reports/CrashReport/metrics");
      return response.data;
    }
  });
}

export default useCrashReportFetchMetrics;
