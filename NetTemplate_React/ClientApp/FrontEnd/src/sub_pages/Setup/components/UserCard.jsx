import { Avatar, Container, Flex, Pill, Stack, Text, Card, Group, Title, Box, Switch, Divider, Skeleton } from "@mantine/core";
import ErrorElement from "~/components/ErrorElement";
import useGetUserById from "~/hooks/Setup/User/useGetUserById";
import moment from "moment";

const UserCard = ({
  id = null
}) => {
  const { data, isLoading, isError, error } = useGetUserById(id);

  if (isLoading) {
    return (
      <Box style={{ viewTransitionName: `usr-card-profile-${id}` }}>
        <Card shadow="xs" w={{ base: '100%', md: '40%' }} >
          <Flex direction="row" gap={20}>
            <Skeleton w={50} h={50} circle />
            <Stack flex={1} p={0} m={0} gap={5}>
              <Skeleton h={30} w={'70%'} />
              <Skeleton h={30} w={'40%'} />
            </Stack>
          </Flex>
        </Card>
      </Box>
    )
  }

  if(isError) {
    return <ErrorElement>{error.response.data?.message || error.message}</ErrorElement>
  }

  if(data.body.length <= 0) {
    return <ErrorElement>No user found</ErrorElement>
  }

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
          <Switch size="xl" checked={data.body[0]?.is_active} onLabel="Active" offLabel="Inactive" />
        </Flex>

        <Divider my={15} />

        <Group justify="space-between">
          <Text variant="text">Last Login:</Text>
          <Text variant="gradient">{moment(data.body[0]?.session_date).calendar()}</Text>
        </Group>

        <Group justify="space-between">
          <Text>Role:</Text>
          <Pill>{data.body[0]?.role}</Pill>
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
