import {
  ScrollArea,
  Table
} from '@mantine/core'
import ErrorElement from '~/components/ErrorElement';
import TableSkeleton from '~/components/Loading/TableSkeleton';
import useGetUsers from '~/hooks/Setup/User/useGetUsers';

const UserTable = () => {
  const { data, isLoading, isError, error } = useGetUsers();

  if(isLoading) {
    return <TableSkeleton rows={3} cols={3} />
  }

  if(isError) {
    return <ErrorElement>{error.response?.data.message || error.message}</ErrorElement>
  }

  const rows = data?.body?.map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>{row.id}</Table.Td>
      <Table.Td>{row.username}</Table.Td>
      <Table.Td>{row.role}</Table.Td>
    </Table.Tr>
  ));

  return (
    <ScrollArea>
      <Table stickyHeader stickyHeaderOffset={0} >
        <Table.Thead >
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Username</Table.Th>
            <Table.Th>Role</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </ScrollArea>
  )
}

export default UserTable;
