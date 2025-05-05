import { useMutation } from "@tanstack/react-query";

const useModuleItemDeleteMutation = () => {
  return useMutation({
    mutationFn: async (params) => {
      const response = await client.delete('/ModuleItems/' +  params.id);

      return response.data;
    }
  })

}

export default useModuleItemDeleteMutation;
