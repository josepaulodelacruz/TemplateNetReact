import { useMutation } from "@tanstack/react-query";
import client from "~/config/client";

const useModuleItemDeleteMutation = () => {

  return useMutation({
    mutationFn: async (params) => {
      const response = await client.delete(`/ModuleItems/${params}`);

      return response.data;
    },
  })

}

export default useModuleItemDeleteMutation;
