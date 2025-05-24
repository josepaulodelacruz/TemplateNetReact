import { useQuery } from "@tanstack/react-query";
import client from "~/config/client";
import QueryKeys from "~/constants/QueryKeys";

const useGetUserHistoryById = (id, page = 1) => {

  return useQuery({
    queryKey: [QueryKeys.USER_HISTORY, id, page],
    staleTime: 5000,
    queryFn: async () => {
      const response = await client.get(`/UserHistory?id=${id}&page=${page}`) ;

      return response.data;
    },
  });
}

export default useGetUserHistoryById;
