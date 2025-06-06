import { useQuery } from "@tanstack/react-query";
import client from "~/config/client";
import QueryKeys from "~/constants/QueryKeys";

const useCrashReportFetch = (page = 1) => {
  return useQuery({
    queryKey: [QueryKeys.REPORTS_CRASH, page],
    queryFn: async () => {
      const response = await client.get(`/Reports/CrashReport?page=${page}`);
      return response.data;
    }
  });
}

export default useCrashReportFetch;
