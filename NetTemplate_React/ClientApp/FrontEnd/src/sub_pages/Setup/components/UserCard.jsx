import { Avatar, Container, Space, Flex, Pill, Stack, Text, Card, Group, Title, Box, Switch, Divider, Skeleton } from "@mantine/core";
import ErrorElement from "~/components/ErrorElement";
import useGetUserById from "~/hooks/Setup/User/useGetUserById";
import moment from "moment";
import { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import useUserUpdateStatusMutation from "~/hooks/Setup/User/useUserUpdateStatusMutation";
import { useQueryClient } from "@tanstack/react-query";
import QueryKeys from "~/constants/QueryKeys";

const UserCard = ({
  id = null
}) => {
  const { data, isLoading, isError, error, isSuccess } = useGetUserById(id);
  const [isActive, setIsActive] = useState(false);
  const useUserStatusMutation = useUserUpdateStatusMutation();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isSuccess) {
      setIsActive(data.body[0]?.is_active);
    }
  }, [isSuccess, data])

  if (isLoading) {
    return (
      <Box style={{ viewTransitionName: `usr-card-profile-${id}` }}>
        <Card shadow="xs" w={{ base: '100%', md: '40%' }} h={200} >
          <Flex direction="row" gap={20}>
            <Skeleton w={50} h={50} circle />
            <Stack flex={1} p={0} m={0} gap={5}>
              <Skeleton h={30} w={'70%'} />
              <Skeleton h={30} w={'40%'} />
            </Stack>
          </Flex>
          <Stack>
            <Space size="lg" />
            <Skeleton h={30} />
            <Skeleton h={30} />
          </Stack>
        </Card>
      </Box>
    )
  }

  if (isError) {
    return <ErrorElement>{error.response.data?.message || error.message}</ErrorElement>
  }

  if (data.body.length <= 0) {
    return <ErrorElement>No user found</ErrorElement>
  }

  const onMangeUpdateUserStatus = (e) => {
    setIsActive(e.currentTarget.checked);
    const request = {
      id: id,
      is_active: e.currentTarget.checked,
    }
    useUserStatusMutation.mutate(request, {
      onSuccess: () => {
        notifications.show({
          color: 'green',
          title: "Success",
          message: "Successfully update user status"
        });
        queryClient.invalidateQueries([QueryKeys.USER_ID, id])
      },
      onError: (error) => {
        const errorMessage = error.response?.data?.message || error.message;
        notifications.show({
          color: 'red',
          title: "Failed Login Attempt",
          message: errorMessage
        })
      }
    });
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
          {
            <Switch size="xl" checked={isActive} onChange={onMangeUpdateUserStatus} onLabel="Active" offLabel="Inactive" />
          }
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
