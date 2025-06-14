import {
  Paper,
  Box,
  Flex,
  Badge,
  Divider,
  Group,
  Button,
  Text,
  Image
} from '@mantine/core';
import moment from 'moment';
import { severityColors } from '~/constants/data';
import { Link, useNavigate } from 'react-router';
import StringRoutes from '~/constants/StringRoutes';
import QueryKeys from '~/constants/QueryKeys';
import useCrashReportById from '~/hooks/CrashReport/useCrashReportById';
import useCrashReport from '~/hooks/CrashReport/useCrashReport';

const ReportCoverPhoto = ({ report }) => {
  if (!report.image_cover) return
  return <Image
    style={{ viewTransitionName: `report-cover-photo-${report.id}` }}
    h={"100%"}
    w="100%"
    fit="cover"
    src={`data:image/png;base64,${report.image_cover}`} />
}

const CrashReportCard = ({
  report = null,
  queryClient
}) => {
  const navigate = useNavigate();
  const { setImageCover } = useCrashReport();

  const handleNavigateTo = async () => {
    queryClient.prefetchQuery({
      queryKey: [QueryKeys.REPORTS_CRASH_VIEW, report.id],
      queryFn: () => useCrashReportById(report.id)
    })

    setImageCover(`${report.image_cover}`)
    navigate(`${StringRoutes.report_crash}/${report.id}`);
  }

  return (
    <Paper shadow="xs" m={0} p={0}>
      <Box w="100%" >
        <Box h="250" bg="primary">
          <ReportCoverPhoto report={report} />
        </Box>
        <Box p={10}>
          <Flex direction={"row"} justify="space-between" align="center">
            <Flex direction="column" >
              <Text size="xs" fw={300} c="dimmed" >Reported by: <Text fw={600} span size="xs" inherit>{report.created_by}</Text> </Text>
              {
                // <Text size="xs" fw={300} c="dimmed" >Date: <Text fw={600} span size="xs" inherit>{moment(report.when, 'MM/DD/yyyy hh:mm:ss a a').format("MMMM Do, YYYY hh:mm a")}</Text> </Text>
              }
              <Text size="xs" fw={300} c="dimmed" >Date: <Text fw={600} span size="xs" inherit>{report.when}</Text> </Text>
            </Flex>
            <Badge color={severityColors[report.severity_level]} size="xs">{report.severity_level}</Badge>
          </Flex>
          <Divider my={5} />
          <Group justify='space-between'>
            <Text size="xs" c="dimmed">Reference ID: <Text span>{report.log_id}</Text> </Text>
            <Badge color="gray" variant='light'>{report.browser}</Badge>
          </Group>
          <Group my={12}>
            <Badge variant='dot'><Text size="xs" inherit c="dimmed">{report.os}</Text></Badge>
          </Group>
          <Text lineClamp={2} size="xs">{report.details} {report.scenario}</Text>
          <Group justify="end" mt={5}>
            <Button
              component={Link}
              viewTransition
              //onClick={() => navigate(`${StringRoutes.report_crash}/${report.id}`)}
              onClick={handleNavigateTo}
              variant="subtle" size="compact-xs">
              See more...
            </Button>
          </Group>
        </Box>
      </Box>
    </Paper>
  )
}

export default CrashReportCard;
