import { useQuery } from "@tanstack/react-query";
import client from "~/config/client";
import QueryKeys from "~/constants/QueryKeys";

const useCrashReportFetchBackendLog = (id) => {
  return useQuery({
    queryKey: [QueryKeys.REPORTS_CRASH_BACKEND_LOGS, id],
    queryFn: async () => {
      console.log(id);
      const response = await client.get(`/Reports/CrashReport/Logs?id=${id}`)
      return response.data;
    }
  });
}

export default useCrashReportFetchBackendLog;
