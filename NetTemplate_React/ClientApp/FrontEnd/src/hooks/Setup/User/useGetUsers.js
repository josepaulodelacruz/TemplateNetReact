import { useQuery } from "@tanstack/react-query";
import client from "~/config/client";
import QueryKeys from "~/constants/QueryKeys";

const useGetUsers = (search = "") => {
  return useQuery({
    queryKey: [QueryKeys.USER_LIST],
    queryFn: async () => {
      const response = await client.get(`/User/${search}`);

      return response.data;
    }
  })


}

export default useGetUsers;

