import { Table, Skeleton, Text, Button, Pill } from "@mantine/core";
import { useEffect } from "react";
import { Link } from "react-router";
import ErrorElement from "~/components/ErrorElement";
import StringRoutes from "~/constants/StringRoutes";
import useGetModuleItems from "~/hooks/Setup/Modules/useGetModuleItems";
import useModuleItems from "~/hooks/Setup/Modules/useModuleItems";

const ModuleItemsTable = () => {
  const { onSetModules } = useModuleItems();
  const { filterModules } = useModuleItems();
  const { data, isLoading, isSuccess, isError, error, refetch } = useGetModuleItems(filterModules);

  useEffect(() => {
    refetch();
  }, [filterModules])

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
      <Table.Tr style={{viewTransitionName: `module-${module.id}`}} key={index}>
        <Table.Td>{module.id}</Table.Td>
        <Table.Td >
          <Text size="sm"  fw={300}>{module.name}</Text>
        </Table.Td>
        <Table.Td>
          {
            module.parent_name &&
            <Pill onChange={null} size="sm">
              {module.parent_name}
            </Pill>
          }
        </Table.Td>
        <Table.Td align="center">
          <Button component={Link} viewTransition to={`${StringRoutes.modules_form}/${module.id}`} variant="light" size="xs">
            View
          </Button>
        </Table.Td>
      </Table.Tr>
    )
  })

  return (
    <Table stickyHeader >
      <Table.Thead>
        <Table.Tr>
          <Table.Th>ID</Table.Th>
          <Table.Th>Name</Table.Th>
          <Table.Th>Parent Module</Table.Th>
          <Table.Th style={{ textAlign: 'center' }}>Action</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {rows}
      </Table.Tbody>
    </Table>
  )
}

export default ModuleItemsTable;
