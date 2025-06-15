import { useQuery } from "@tanstack/react-query";
import client from "~/config/client";
import QueryKeys from "~/constants/QueryKeys";

const useCrashReportFetch = (page = 1, filters = []) => {
  return useQuery({
    queryKey: [QueryKeys.REPORTS_CRASH, page],
    queryFn: async () => {
      const filterToString = filters.join(',');
      const paramFilter = filterToString.length > 0 ? `&filter=${filterToString}` : '';
      const response = await client.get(`/Reports/CrashReport?page=${page}${paramFilter}`);
      return response.data;
    }
  });
}

export default useCrashReportFetch;
