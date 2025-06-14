import { Card, Box, Group, ThemeIcon, Badge, Timeline, Text } from "@mantine/core";
import { Bug, Clock, MapPin, AlertTriangle } from "lucide-react";
import { severityColors } from "~/constants/data";
import moment from "moment";

const CrashReportTimelineCard = ({
  errorDetails = null,
  severity = "",
  padding = null,
  margin = null,
  referenceId = null
}) => {

  const what = errorDetails?.what;

  return (
    <Card withBorder shadow="xs" radius="md" m={margin || 0} p={padding || 'lg'}>
      <Group justify='space-between' mb="lg" >
        <Group>
          <ThemeIcon color="red" variant='light'>
            <Bug size={18} />
          </ThemeIcon>
          <Box>
            <Text fw={600}>Error Details</Text>
            <Text size="sm" c="dimmed">ID: {errorDetails?.error?.response?.data?.reference_id || referenceId}</Text>
          </Box>
        </Group>
        <Badge color={severityColors[severity]} size="sm" variant='light'>
          {severity?.toUpperCase()}
        </Badge>
      </Group>
      <Timeline active={-1} bulletSize={24} lineWidth={2}>
        <Timeline.Item
          bullet={<Clock size={12} />}
          title="When"
        >
          <Text size="sm" c="dimmed">{moment().format("MM/DD/YYYY, hh:mm A")}</Text>
        </Timeline.Item>
        <Timeline.Item
          bullet={<MapPin size={12} />}
          title="Where"
        >
          <Text size="sm" c="dimmed">{errorDetails?.where}</Text>
        </Timeline.Item>
        <Timeline.Item
          bullet={<AlertTriangle size={12} />}
          title="What"
        >
          <Text size="sm" c="dimmed">{ what ?? (`${errorDetails?.error.name}: ${errorDetails?.error.message}`)}</Text>
        </Timeline.Item>
      </Timeline>
    </Card>

  )

}

export default CrashReportTimelineCard;
