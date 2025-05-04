import { Table, Skeleton, Text } from "@mantine/core";
import { useEffect } from "react";
import ErrorElement from "~/components/ErrorElement";
import useGetModuleItems from "~/hooks/Setup/Modules/useGetModuleItems";
import useModuleItems from "~/hooks/Setup/Modules/useModuleItems";

const ModuleItemsTable = () => {
  const { onSetModules } = useModuleItems();
  const { data, isLoading, isSuccess, isError, error } = useGetModuleItems();

  useEffect(() => {
    if (isSuccess) {
      const items = data.body?.map((item) => ({
        value: item.id.toString(),
        label: item.name,
      }))
      onSetModules(items);
    }
  }, [isSuccess])

  if (isLoading) {
    return <Skeleton height={50} />
  }

  if (isError) {
    return <ErrorElement>{error.response?.data.message || error.message}</ErrorElement>
  }


  const rows = data.body?.map((module, index) => {
    return (
      <Table.Tr key={index}>
        <Table.Td>{module.id}</Table.Td>
        <Table.Td>
          <Text size="sm" fw={300}>{module.name}</Text>
        </Table.Td>
        <Table.Td>
        </Table.Td>
      </Table.Tr>
    )
  })

  return (
    <Table stickyHeader stickyHeaderOffset={0}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>ID</Table.Th>
          <Table.Th>Name</Table.Th>
          <Table.Th>Parent Module</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {rows}
      </Table.Tbody>
    </Table>
  )
}

export default ModuleItemsTable;
