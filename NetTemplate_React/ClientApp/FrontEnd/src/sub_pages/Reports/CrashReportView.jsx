import {
  Container,
  Image,
  Grid,
  Group,
  Paper,
  Title,
  UnstyledButton,
  Stack,
  Text,
  Badge,
  Avatar,
  Divider,
  Box,
  Code,
  ScrollArea,
  Skeleton
} from "@mantine/core";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams, Link } from "react-router";
import { useElementSize, useMediaQuery } from "@mantine/hooks";
import CrashReportTimelineCard from "./components/CrashReportTimelineCard";
import useCrashReportById from "~/hooks/CrashReport/useCrashReportById";
import moment from "moment";
import { severityColors } from "~/constants/data";
import ErrorElement from "~/components/ErrorElement";
import useCrashReport from "~/hooks/CrashReport/useCrashReport";

const CrashReportView = () => {
  const navigate = useNavigate();
  const { ref, height } = useElementSize();
  const { id } = useParams();
  const { imageCover } = useCrashReport();
  const { data: report, isLoading, isSuccess, isError } = useCrashReportById(id);
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isSuccess && !isLoading && !report?.body) {
    return <ErrorElement>No report found</ErrorElement>;
  }

  const handleBackNavigation = () => {
    // Use Link with viewTransition for back navigation
    navigate(-1);
  };

  const _imageSrc = !imageCover ? report?.body?.image_bins[0] : imageCover;

  return (
    <Container fluid>
      <Group ref={ref}>
        <UnstyledButton
          component={Link}
          to=".."
          relative="path"
          viewTransition
          p={0}
          m={0}
        >
          <ArrowLeft />
        </UnstyledButton>
        <Title component={'span'} size={50} fw={700}>Crash Reports</Title>
      </Group>
      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Container
            style={{ height: `calc(100vh - ${height + 95}px)` }}
            bg='#1C1C1C'
          >
            {
              <Image
                style={{ viewTransitionName: `report-cover-photo-${id}` }}
                h={"100%"}
                w="100%"
                fit="contain"
                src={`data:image/png;base64,${_imageSrc}`}
              />
            }
          </Container>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          {
            isLoading ?
              <CrashSkeletonLoading height={height} isMobile={isMobile} /> :
              <CrashDetails
                height={height}
                isMobile={isMobile}
              >
                {/* User details */}
                <Group px={5} py={10}>
                  <Avatar alt="dp">JM</Avatar>
                  <Stack flex={1} justify="center" gap={0}>
                    <Title size="md" fw={600}>{report?.body?.created_by}</Title>
                    <Text size="xs" c="dimmed">{moment().calendar()}</Text>
                  </Stack>
                  <Badge
                    color={severityColors[report?.body?.severity_level]}
                    size="xs"
                  >
                    {report?.body?.severity_level}
                  </Badge>
                </Group>
                <Group px={10} py={0} gap="xs">
                  <Badge size="xs" variant="dot">{report?.body?.os}</Badge>
                  <Badge size="xs" variant="dot">{report?.body?.browser}</Badge>
                </Group>

                {/* Header post details */}
                <Container p={10}>
                  <Text size="sm" fw={300}>{report?.body?.details}</Text>
                </Container>

                <CrashReportTimelineCard
                  margin={10}
                  padding={0}
                  severity={report?.body?.severity_level}
                  errorDetails={{
                    when: report?.body?.when,
                    where: report?.body?.where,
                    what: report?.body?.what,
                    stackTrace: "",
                    userAgent: "",
                    email: "",
                    severityLevel: "",
                    details: "",
                    scenario: "",
                    error: {},
                  }}
                />

                <Box p={10}>
                  <Title size="md" fw={500}>Steps to reproduce</Title>
                  <Divider my={5} />
                  <Text fw={300} size="sm">{report?.body?.scenario}.</Text>
                </Box>

                <Box p={10}>
                  <Title size="md" fw={500}>Stack Trace</Title>
                  <Divider my={5} />
                  <Code block>{report?.body?.stack_trace}</Code>
                </Box>
              </CrashDetails>
          }

        </Grid.Col>
      </Grid>
    </Container>
  );
};

const CrashDetails = ({
  isMobile,
  children,
  height
}) => {

  return isMobile ? (
    <Paper w="100%" p={10} m={0}>
      {children}
    </Paper>
  ) : (
    <ScrollArea h={`calc(100vh - ${height + 95}px)`} w="100%">
      <Paper
        w="100%"
        p={10}
        m={0}
      >
          {children}
      </Paper>
    </ScrollArea>
  )
}

const CrashSkeletonLoading = ({ isMobile, height }) => {
  return (
    <Paper
      component={ScrollArea}
      h={isMobile ? '50vh' : `calc(100vh - ${height + 95}px)`}
      w={'100%'}
      p={10}
      m={0}
    >
      {/* User details skeleton */}
      <Group px={5} py={10}>
        <Skeleton height={40} circle />
        <Stack flex={1} justify="center" gap={5}>
          <Skeleton height={16} width="60%" />
          <Skeleton height={12} width="40%" />
        </Stack>
        <Skeleton height={20} width={60} radius="xl" />
      </Group>

      {/* Badges skeleton */}
      <Group px={10} py={0} gap="xs">
        <Skeleton height={20} width={50} radius="xl" />
        <Skeleton height={20} width={60} radius="xl" />
      </Group>

      {/* Details skeleton */}
      <Container p={10}>
        <Skeleton height={12} mb={5} />
        <Skeleton height={12} mb={5} />
        <Skeleton height={12} width="80%" />
      </Container>

      {/* Timeline card skeleton */}
      <Box p={10}>
        <Skeleton height={100} radius="md" />
      </Box>

      {/* Steps to reproduce skeleton */}
      <Box p={10}>
        <Skeleton height={18} width="50%" mb={10} />
        <Skeleton height={1} mb={10} />
        <Skeleton height={12} mb={5} />
        <Skeleton height={12} width="70%" />
      </Box>

      {/* Stack trace skeleton */}
      <Box p={10}>
        <Skeleton height={18} width="40%" mb={10} />
        <Skeleton height={1} mb={10} />
        <Skeleton height={80} radius="md" />
      </Box>
    </Paper>
  )
}

export default CrashReportView;
