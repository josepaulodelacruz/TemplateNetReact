import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "~/config/client";
import QueryKeys from "~/constants/QueryKeys";

const useModuleItemDeleteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params) => {
      const response = await client.delete(`/ModuleItems/${params}`);

      return response.data;
    },
  })

}

export default useModuleItemDeleteMutation;
