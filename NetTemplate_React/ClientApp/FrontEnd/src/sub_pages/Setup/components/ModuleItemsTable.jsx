import { Table, Skeleton, Text } from "@mantine/core";
import ErrorElement from "~/components/ErrorElement";
import useGetModuleItems from "~/hooks/Setup/Modules/useGetModuleItems";

const ModuleItemsTable = () => {
  const { data, isLoading, isError, error } = useGetModuleItems();

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
