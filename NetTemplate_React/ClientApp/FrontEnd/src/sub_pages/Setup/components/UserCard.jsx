import { Avatar, Flex, Pill, Stack, Text, Card, Group, Title, Box, Switch, Divider } from "@mantine/core";

const UserCard = ({
  id = null
}) => {
  return (
    <Box style={{ viewTransitionName: `usr-card-profile-${id}` }} py={15}>
      <Card shadow="xs" w={{ base: '100%', md: '40%' }}>
        <Flex align="center" direction="row" gap={20} justify="space-between">
          <Flex flex={1} gap={20}>
            <Avatar alt="dp">
              JM
            </Avatar>
            <Stack p={0} m={0} gap={0}>
              <Title size="md">Jose Paulo Dela Cruz</Title>
              <Text fw={300} color="blue">delacruzjosepaulo@gmail.com</Text>
            </Stack>
          </Flex>
          <Switch size="xl" onLabel="Active" offLabel="Inactive" />
        </Flex>

        <Divider my={15} />

        <Group justify="space-between">
          <Text variant="text">Last Login:</Text>
          <Text variant="gradient">December 23, 2025 08:00 AM</Text>
        </Group>

        <Group justify="space-between">
          <Text>Role:</Text>
          <Pill>User</Pill>
        </Group>

        <Group justify="space-between">
          <Text>Department:</Text>
          <Pill>Finance</Pill>
        </Group>

        <Group justify="space-between">
          <Text>Created By:</Text>
          <Text>Admin</Text>
        </Group>
      </Card>
    </Box>
  )
}

export default UserCard;
