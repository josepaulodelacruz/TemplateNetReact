import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "~/config/client";
import QueryKeys from "~/constants/QueryKeys";

const useModuleItemsAddMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params) => {
      const response = await client.post('/ModuleItems', params);

      return response.data; 
    },
    onSuccess: () => queryClient.invalidateQueries([QueryKeys.MODULE_ITEMS])
  })
}

export default useModuleItemsAddMutation;
