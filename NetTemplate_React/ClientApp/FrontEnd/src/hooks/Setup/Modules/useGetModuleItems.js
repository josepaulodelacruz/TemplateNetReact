import { useQuery } from "@tanstack/react-query";
import client from "~/config/client";

const useGetModuleItems = () => {
  return useQuery({
    queryKey: ['module-items'],
    queryFn: async () => {
      const response = await client.get('/ModuleItems')

      return response.data;
    }
  })
}

export default useGetModuleItems;
