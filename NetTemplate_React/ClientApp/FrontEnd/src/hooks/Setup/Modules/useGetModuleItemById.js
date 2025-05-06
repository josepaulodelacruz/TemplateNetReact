import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import client from "~/config/client";
import QueryKeys from "~/Constants/QueryKeys";

const useGetModuleItemById = () => {
  const { id } = useParams();

  return useQuery({
    queryKey: [QueryKeys.MODULE_ITEM_ID, id],
    queryFn: async () => {
      const response = await client.get('/ModuleItems/' + id);

      return response.data;
    },
    enabled: (id === undefined ? false : true), // if true fetch on page mount
  })
}

export default useGetModuleItemById;
