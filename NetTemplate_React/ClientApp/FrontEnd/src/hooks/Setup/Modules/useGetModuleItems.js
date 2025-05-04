import { useQuery } from "@tanstack/react-query";
import client from "~/config/client";
import QueryKeys from "~/constants/QueryKeys";

const useGetModuleItems = () => {
  return useQuery({
    queryKey: [QueryKeys.MODULE_ITEMS],
    queryFn: async () => {
      const response = await client.get('/ModuleItems')

      return response.data;
    }
  })
}

export default useGetModuleItems;
