import { useQuery } from "@tanstack/react-query";
import client from "~/config/client";
import QueryKeys from "~/constants/QueryKeys";

const useGetUserPermission = (id) => {
  return useQuery({
    queryKey: [QueryKeys.USER_PERMISSION, id],
    queryFn: async () => {
      const response = await client.get('/UserPermission/' + id);
      return response.data;
    }
  })
}

export default useGetUserPermission;
