
import { Group, Button } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { useEffect } from "react";
import useCrashReport from "~/hooks/CrashReport/useCrashReport"

export const notificationWithCrashReportButton = ({
  color = 'red',
  title = "Error",
  message = "Something went wrong",
  onClick
}) => {
  return notifications.show({
    color: color,
    title: title,
    message: <Group justify="space-between">
      <span>{message}</span>
      <Button onClick={onClick} color="red" variant="light">Sumbit Crash report</Button>
    </Group>
  })
}
