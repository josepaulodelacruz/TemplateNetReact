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
  ScrollArea 
} from "@mantine/core";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams, Link } from "react-router";
import { useElementSize } from "@mantine/hooks";
import CrashReportTimelineCard from "./components/CrashReportTimelineCard";
import useCrashReportById from "~/hooks/CrashReport/useCrashReportById";
import moment from "moment";
import { severityColors } from "~/constants/data";
import ErrorElement from "~/components/ErrorElement";

const CrashReportView = () => {
  const navigate = useNavigate();
  const { ref, height } = useElementSize();
  const { id } = useParams();
  const { data: report, isLoading, isSuccess, isError } = useCrashReportById(id);
  
  if (isSuccess && !isLoading && !report?.body) {
    return <ErrorElement>No report found</ErrorElement>;
  }

  const handleBackNavigation = () => {
    // Use Link with viewTransition for back navigation
    navigate(-1);
  };

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
              /*TODO use the image cover if user nvigate here from store*/
              report?.body?.image_bins?.[0] && (
              <Image
                style={{ viewTransitionName: `report-cover-photo-${id}` }}
                h={"100%"}
                w="100%"
                fit="contain"
                src={`data:image/png;base64,${report.body.image_bins[0]}`}
              />
            )}
          </Container>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper 
            component={ScrollArea} 
            h={`calc(100vh - ${height + 95}px)`} 
            w={'100%'} 
            p={10} 
            m={0}
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
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default CrashReportView;
