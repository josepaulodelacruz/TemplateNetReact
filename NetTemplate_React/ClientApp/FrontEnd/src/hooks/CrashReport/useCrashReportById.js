import { useQuery, QueryClient } from "@tanstack/react-query";
import client from "~/config/client";
import QueryKeys from "~/constants/QueryKeys";


const useCrashReportById = (id = null) => {
  return useQuery({
    queryKey: [QueryKeys.REPORTS_CRASH_VIEW, id],
    queryFn: () => fetchReportById(id),
    enabled: !!id,
  });
}


export const fetchReportById = async (id) => {
  try {
      const response = await client.get(`/Reports/CrashReport/${id}`)
      
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      return response.data;
  } catch (err) {
    throw new Error(err);
  }
}

export default useCrashReportById;
