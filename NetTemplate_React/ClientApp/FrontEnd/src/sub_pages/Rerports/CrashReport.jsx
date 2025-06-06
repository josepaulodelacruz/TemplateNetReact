import { Container, Grid, GridCol, Group, Paper, Title } from "@mantine/core";

const HeroCard = () => {
  return (
    <Paper>
      1
    </Paper>
  )
}

const CrashReport = () => {
  return (
    <Container fluid>
      <Group>
        <Title size={50} fw={700} style={{ viewTransitionName: 'rpt-header' }}>Crash Reports</Title>
      </Group>

      <Grid >
        <Grid.Col span={4} >
          <Grid >
            <Grid.Col span={6}><HeroCard /></Grid.Col>
            <Grid.Col span={6}><HeroCard /></Grid.Col>
            <Grid.Col span={6}><HeroCard /></Grid.Col>
            <Grid.Col span={6}><HeroCard /></Grid.Col>
          </Grid>
        </Grid.Col>
        <Grid.Col span='auto' h={500}   >
          <HeroCard />
        </Grid.Col>
      </Grid>


    </Container>
  )
}

export default CrashReport;
