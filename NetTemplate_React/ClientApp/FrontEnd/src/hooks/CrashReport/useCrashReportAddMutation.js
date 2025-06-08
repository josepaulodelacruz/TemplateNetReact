import { useMutation } from "@tanstack/react-query";
import client from "~/config/client";

const useCrashReportAddMutation = () => {
  return useMutation({
    mutationFn: async (params) => {
      const response = await client.post('/Reports/CrashReport', params, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      })
      return response.data;
    }
  })

}

export default useCrashReportAddMutation; 
