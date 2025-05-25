
import { Group, Button } from "@mantine/core"
import { notifications } from "@mantine/notifications"

export const notificationWithCrashReportButton = ({
  color = 'red',
  title = "Error",
}) => {
  notifications.show({
    color: color,
    title: title,
    message: <Group justify="space-between">
      <span>Something went wrong.</span>
      <Button color="red" variant="light">Sumbit Crash report</Button>
    </Group>
  })
}
