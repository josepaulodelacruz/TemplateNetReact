import { useQuery } from "@tanstack/react-query";
import client from "~/config/client";
import QueryKeys from "~/constants/QueryKeys";


const useGetUserById = (id = null) => {
  return useQuery({
    queryKey: [QueryKeys.USER_ID, id],
    queryFn: async () => {
      const response = await client.get("/User/" + id);
      return response.data;
    }
  })
}

export default useGetUserById;
