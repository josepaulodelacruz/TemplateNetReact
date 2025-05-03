import { useMutation } from "@tanstack/react-query";
import client from "~/config/client";

const useLoginMutation = () => {
  return useMutation({
    mutationFn: async (params) => {
      return client.post('/auth/login', params);
    },
    onSuccess: (_) => {},
  })

}

export default useLoginMutation;
