import {
  Container,
  Title,
  Text,
  Box,
  MultiSelect,
  Paper,
  Space,
  Table,
  Flex,
  Button,
  Group
} from "@mantine/core";
import { NavLink } from "react-router";
import StringRoutes from "~/constants/StringRoutes";

const ModulesInitialPage = () => {
  return (
    <>
      <Title size={'50'} p={0} fw={700}>Modules</Title>
      <Text size={'sm'}>Setup for modules</Text>
      <Flex justify="space-between" direction={{ base: 'column', md: 'row' }}>
        <Box w={{ base: '100%', md: 400 }} >
          <MultiSelect
            clearable
            placeholder="Filter modules"
            data={['Setup', 'Dashboard', 'Users', 'Modules']}
            comboboxProps={{ position: 'bottom', middlewares: { flip: false, shift: false }, offset: 0 }}
          />
        </Box>
        <Box mt={{ base: 20, md: 0 }}>
          <Group justify="flex-end">
            <Button component={NavLink} to={StringRoutes.modules_form} >
              Add Module
            </Button>
          </Group>
        </Box>
      </Flex>
      <Space h={20} />
      <Paper p={0}>
        <Table stickyHeader stickyHeaderOffset={0}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Parent Module</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td>1</Table.Td>
              <Table.Td>
                <Text size="sm" fw={300}>Dashboard</Text>
              </Table.Td>
              <Table.Td>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Paper>
    </>
  )
}

export default ModulesInitialPage;
