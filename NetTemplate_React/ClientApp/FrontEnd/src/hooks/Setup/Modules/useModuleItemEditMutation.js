import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useParams } from "react-router";
import client from "~/config/client";
import QueryKeys from "~/Constants/QueryKeys";

const useModuleItemEditMutation = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params) => {
      const response = await client.put(`/ModuleItems/${id}`, params)

      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries([QueryKeys.MODULE_ITEMS]),
  })
}

export default useModuleItemEditMutation;
