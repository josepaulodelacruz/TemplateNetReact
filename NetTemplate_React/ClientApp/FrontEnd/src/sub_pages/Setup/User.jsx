import {
  Container,
  Stack,
  Text,
  Title,
  TextInput,
  Box,
  Card
} from "@mantine/core";
import UserTable from "./components/UserTable";


export default function User() {
  return (
    <Container fluid>
      <Stack>
        <Title size={'50'} p={0} fw={700}>User Accounts</Title>
        <Text size="xl" fw={500}>List of account</Text>
        <Box
          w={{ sm: '100%', md: '20em' }} >
          <TextInput
            variant="default"
            placeholder="User"
          />
        </Box>
        <Card p={0} shadow="sm">
          <UserTable />
        </Card>
      </Stack>
    </Container>
  )
}
