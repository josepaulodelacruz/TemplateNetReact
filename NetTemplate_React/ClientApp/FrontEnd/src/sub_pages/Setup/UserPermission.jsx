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

const UserPermission = () => {

  const handleSave = () => {
    console.log('saving');
  }

  return (
    <Container fluid p={0}>
      <Flex direction={{base: 'column', md: 'row'}} justify="space-between" align="flex-end">
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
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: '2%' }}></Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th style={{ textAlign: 'center' }}>Permission</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr >
              <Table.Td align="center">
                <Checkbox />
              </Table.Td>
              <Table.Td>
                <Title size="sm" fw={500}>Module Name</Title>
              </Table.Td>
              <Table.Td valign="middle" align="center">
                <Group justify="center">
                  <Checkbox label="Create" />
                  <Checkbox label="Read" />
                  <Checkbox label="Update" />
                  <Checkbox label="Delete" />
                </Group>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Card>

    </Container>
  )
}

export default UserPermission;
