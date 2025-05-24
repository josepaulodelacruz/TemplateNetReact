import { useQuery } from "@tanstack/react-query";
import client from "~/config/client";
import QueryKeys from "~/constants/QueryKeys";

const useGetUserHistoryById = (id) => {

  return useQuery({
    queryKey: [QueryKeys.USER_HISTORY, id],
    queryFn: async (params) => {
      const response = await client.get(`/UserHistory?id=${id}&page=${1}`) ;

      return response.data;
    }
  });
}

export default useGetUserHistoryById;
