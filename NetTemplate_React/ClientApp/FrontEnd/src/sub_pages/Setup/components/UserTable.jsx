import {
  Button,
  ScrollArea,
  Table
} from '@mantine/core'
import { useEffect, useImperativeHandle } from 'react';
import { Link } from 'react-router';
import ErrorElement from '~/components/ErrorElement';
import TableSkeleton from '~/components/Loading/TableSkeleton';
import StringRoutes from '~/constants/StringRoutes';
import useGetUsers from '~/hooks/Setup/User/useGetUsers';

const UserTable = ({ref, search = ""}) => {
  const { data, isLoading, isError, error, refetch } = useGetUsers(search);

  useImperativeHandle(ref, () => ({
    handleEvent: () => {
      refetch();
    }
  }))

  if (isLoading) {
    return <TableSkeleton rows={3} cols={3} />
  }

  if (isError) {
    return <ErrorElement>{error.response?.data.message || error.message}</ErrorElement>
  }

  const rows = data?.body?.map((row, index) => (
    <Table.Tr key={index} style={{ viewTransitionName: `usr-card-profile-${row.id}`}}>
      <Table.Td>{row.id}</Table.Td>
      <Table.Td>{row.username}</Table.Td>
      <Table.Td>{row.role}</Table.Td>
      <Table.Td align="center">
        <Button variant='light' size="sm" component={Link} viewTransition to={`${StringRoutes.users_permission}/${row.id}`}>
          View
        </Button>
      </Table.Td>
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
            <Table.Th style={{textAlign: 'center'}}>Action</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </ScrollArea>
  )
}

export default UserTable;
