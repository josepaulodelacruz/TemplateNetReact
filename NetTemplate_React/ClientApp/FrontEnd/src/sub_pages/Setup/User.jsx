import {
  Container,
  Title,
  TextInput,
  Box,
  Card,
  Group,
  Button,
  Stack,
} from "@mantine/core";
import UserTable from "./components/UserTable";
import { notificationWithCrashReportButton } from "~/utils/notification";
import useCrashReport from "~/hooks/CrashReport/useCrashReport";
import { useEffect } from "react";

const User = () => {
  const { onTriggerCrashReportModal, isCrashReportModal } = useCrashReport();

  useEffect(() => {
    console.log(isCrashReportModal);
  }, [isCrashReportModal])

  const handleTest = () => {
    notificationWithCrashReportButton({
      color: 'red',
      title: "Failure to login",
      onClick: () => {
        onTriggerCrashReportModal();
      }
    });
  }

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
