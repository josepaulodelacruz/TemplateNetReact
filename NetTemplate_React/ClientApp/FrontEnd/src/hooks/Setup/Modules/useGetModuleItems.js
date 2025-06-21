import { useQuery } from "@tanstack/react-query";
import client from "~/config/client";
import QueryKeys from "~/constants/QueryKeys";

const useGetModuleItems = (filterModules = []) => {
  return useQuery({
    queryKey: [QueryKeys.MODULE_ITEMS],
    queryFn: async () => {
      const modules = filterModules.join(',');
      const response = await client.get('/ModuleItems/' + modules)

      return response.data;
    }
  })
}

export default useGetModuleItems;
