import {
  Container,
  Title,
  TextInput,
  Box,
  Card,
  Group,
} from "@mantine/core";
import UserTable from "./components/UserTable";


const User = () => {
  return (
    <Container fluid>
      <Group>
        <Title size={50} fw={700} style={{ viewTransitionName: 'usr-header' }}>Users Accounts</Title>
      </Group>
      <Box
        py={20}
        w={{ sm: '100%', md: '20em' }} >
        <TextInput
          variant="default"
          placeholder="User"
        />
      </Box>
      <Card p={0} shadow="xs">
        <UserTable />
      </Card>

    </Container >
  )
}

export default User;
