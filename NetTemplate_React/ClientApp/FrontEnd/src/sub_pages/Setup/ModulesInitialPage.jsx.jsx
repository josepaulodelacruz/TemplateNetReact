import {
  Container,
  Title,
  Text,
  Box,
  MultiSelect,
  Card,
  Space,
  Table,
  Flex,
  Button,
  Group,
  UnstyledButton
} from "@mantine/core";
import { ChevronLeft } from "lucide-react";
import { NavLink } from "react-router";
import StringRoutes from "~/constants/StringRoutes";

const ModulesInitialPage = () => {
  return (
    <>
      <Title component={'span'} style={{ viewTransitionName: 'mdl-header' }} size={50} fw={700}>Modules</Title>
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
            <Button component={NavLink} to={StringRoutes.modules_form} viewTransition >
              Add Module
            </Button>
          </Group>
        </Box>
      </Flex>
      <Space h={20} />
      <Card  p={0}>
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
      </Card>
    </>
  )
}

export default ModulesInitialPage;
