
import { useMutation } from "@tanstack/react-query";
import client from "~/config/client";

const useUserUpdateStatusMutation = () => {
  return useMutation({
    mutationFn: async (params) => {
      const response = await client.put(`/User/change-status/${params.id}?is_active=${params.is_active}`)
      return response.data;
    },
  })
}

export default useUserUpdateStatusMutation;
