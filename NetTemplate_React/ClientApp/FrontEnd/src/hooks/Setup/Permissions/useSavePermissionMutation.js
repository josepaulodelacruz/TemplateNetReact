import { useMutation } from "@tanstack/react-query";
import client from "~/config/client";

const useSavePermissionMutation = () => {
  return useMutation({
    mutationFn: async (params) => {
      const response = await client.post('/UserPermission', params);
      return response.data;
    }
  })
}

export default useSavePermissionMutation;
