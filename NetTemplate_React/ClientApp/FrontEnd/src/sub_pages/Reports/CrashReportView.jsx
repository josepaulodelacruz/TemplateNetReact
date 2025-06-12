import { Container, Card, Grid, Group, Paper, Title, UnstyledButton } from "@mantine/core";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { useElementSize } from "@mantine/hooks";

const CrashReportView = () => {
  const navigate = useNavigate();
  const { ref, height } = useElementSize();
  const { id } = useParams();
  return (
    <Container fluid>
      <Group ref={ref}>
        <UnstyledButton onClick={() => navigate(-1)} p={0} m={0}>
          <ArrowLeft />
        </UnstyledButton>
        <Title component={'span'} size={50} fw={700} >Crash Reports</Title>
      </Group>

      <Grid >
        <Grid.Col span={8}>
          <Container
            style={{ viewTransitionName: `report-cover-photo-${id}`, height: `calc(100vh - ${height + 95}px)` }}
            bg='blue'>


          </Container>
        </Grid.Col>
        <Grid.Col span={4}>
          <Paper w={'100%'} p={0} m={0}>
            test
          </Paper>
        </Grid.Col>

      </Grid>
    </Container>
  )
}

export default CrashReportView;
