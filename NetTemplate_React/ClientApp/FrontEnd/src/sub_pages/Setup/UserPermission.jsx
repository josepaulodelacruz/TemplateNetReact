import {
  Checkbox,
  Container,
  Paper,
  Title,
  Group,
  Card,
  Button,
  Table,
  Space,
  Flex
} from "@mantine/core";
import { useParams } from "react-router";
import ErrorElement from "~/components/ErrorElement";
import TableSkeleton from "~/components/Loading/TableSkeleton";
import useGetUserPermission from "~/hooks/Setup/Permissions/useGetUserPermission";

const UserPermissionTable = () => {
  const { id } = useParams()
  const { data, isLoading, isError, error } = useGetUserPermission(id);

  if (isLoading) {
    return <TableSkeleton />
  }

  if (isError) {
    return <ErrorElement>Someting went wrong</ErrorElement>
  }

  const rows = Array.isArray(data.body) && data.body.length > 0 && data.body?.map((item) => {
    return (
      <Table.Tr h={45} key={item.id} >
        <Table.Td align="center">
          <Checkbox />
        </Table.Td>
        <Table.Td>
          <Title size="sm" fw={500}>{item.name}</Title>
        </Table.Td>
        <Table.Td valign="middle" align="center">
          <Flex direction={{base: 'column', md: 'row'}} gap={20} justify="center">
            <Checkbox label="Create" />
            <Checkbox label="Read" />
            <Checkbox label="Update" />
            <Checkbox label="Delete" />
          </Flex>

        </Table.Td>
      </Table.Tr>
    )
  })

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th style={{ width: '2%' }}></Table.Th>
          <Table.Th>Name</Table.Th>
          <Table.Th style={{ textAlign: 'center' }}>Permission</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {rows}
      </Table.Tbody>
    </Table>
  )

}

const UserPermission = () => {

  const handleSave = () => {
  }

  return (
    <Container fluid p={0}>
      <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align="flex-end">
        <Paper w={{ base: '100%', md: '50%' }} mt={10} radius="xs">
          <Title size="lg">Actions</Title>
          <Group justify="space-between">
            <Group>
              <Checkbox label="Create" />
              <Checkbox label="Read" />
              <Checkbox label="Update" />
              <Checkbox label="Delete" />
            </Group>
            <Button variant="outline">
              Apply to all Selected
            </Button>
          </Group>
        </Paper>

        <Button onClick={handleSave}>
          Save
        </Button>

      </Flex>


      <Space h={'lg'} />

      <Card p={0}>
        <UserPermissionTable />
      </Card>

    </Container>
  )
}

export default UserPermission;
