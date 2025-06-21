import { Button, Flex, Text, Group, Paper, Stack, ThemeIcon, Title, Skeleton } from "@mantine/core";
import { ArrowUp, Info } from "lucide-react";
import CrashReportLineChart from "./CrashReportLineChart";
import useCrashReportFetchMetrics from "~/hooks/CrashReport/useCrashReportFetchMetrics";
import ErrorElement from "~/components/ErrorElement";
import { useEffect } from "react";


const PercentageColorIndicator = ({
  percentage
}) => {
  return (
    <Button size="compact-md" color="red" variant="light">
      <ArrowUp size={18} />
      <Text fw={900} size={13}>{percentage}</Text>
    </Button>
  )
}

const HeroCard = ({
  title = "",
  count = 0,
  percentage = null
}) => {
  return (
    <Paper w={'100%'} shadow="xs">
      <Stack>
        <Group>
          <Title size="lg">{title}</Title>
          <ThemeIcon color="white" variant="light" size="xs">
            <Info size={18} />
          </ThemeIcon>
        </Group>
        <Group>
          <Title size="h1">{count}</Title>
          {percentage && (
            <PercentageColorIndicator percentage={percentage} />
          )}
        </Group>
        <Text c="dimmed" size={"xs"}>
          Crashes up <Text inherit span c="red" fw={800}>12.32%</Text> since last month
        </Text>
      </Stack>
    </Paper>
  )
}

const CrashReportMetrics = ({ filterDate = 'MONTH' }) => {
  const { data, isLoading, isSuccess, error, isError } = useCrashReportFetchMetrics(filterDate);

  if(isLoading) {
    return <CrashReportMetricsSkeleton />
  }

  if(isError) {
    return <ErrorElement>{error.message}</ErrorElement>
  }

  return (
    <Flex gap="lg" direction={{ base: 'column', md: 'row' }} >
      <Flex flex={1.2} gap="sm" direction="column">
        <Flex direction="row" gap="sm">
          <HeroCard title="Total Crashes" count={data?.body?.crash_counts?.total_crashes} percentage={`${data?.body?.crash_counts.crashes_percent_change}%`} />
          <HeroCard title="Affected Users" count={data?.body?.crash_counts?.affected_users} percentage="90%" />
        </Flex>
        <Flex direction="row" gap="sm" >
          <HeroCard title="Crash Free Sessions" count={data?.body?.crash_counts?.crash_free_sessions} />
          <HeroCard title="Critical System Failure" count={data?.body?.crash_counts?.crash_free_sessions} />
        </Flex>
      </Flex>
      <Flex gap="sm" flex={2}>
        <CrashReportLineChart lineCharts={data?.body?.line_charts} />
      </Flex>
    </Flex>

  );
}


const HeroCardSkeleton = () => {
  return (
    <Paper w={'100%'} shadow="xs" p="md">
      <Stack gap="sm">
        <Group>
          <Skeleton height={24} width={120} radius="sm" />
          <Skeleton height={16} width={16} radius="xl" />
        </Group>
        <Group>
          <Skeleton height={32} width={60} radius="sm" />
          <Skeleton height={28} width={80} radius="md" />
        </Group>
        <Skeleton height={12} width="80%" radius="sm" />
      </Stack>
    </Paper>
  )
}

const CrashReportLineChartSkeleton = () => {
  return (
    <Paper w={'100%'} shadow="xs" p="md" h={300}>
      <Stack gap="md">
        <Skeleton height={20} width={150} radius="sm" />
        <Skeleton height={250} width="100%" radius="sm" />
      </Stack>
    </Paper>
  )
}

const CrashReportMetricsSkeleton = () => {
  return (
    <Flex gap="lg" direction={{ base: 'column', md: 'row' }}>
      <Flex flex={1.2} gap="sm" direction="column">
        <Flex direction="row" gap="sm">
          <HeroCardSkeleton />
          <HeroCardSkeleton />
        </Flex>
        <Flex direction="row" gap="sm">
          <HeroCardSkeleton />
          <HeroCardSkeleton />
        </Flex>
      </Flex>
      <Flex gap="sm" flex={2}>
        <CrashReportLineChartSkeleton />
      </Flex>
    </Flex>
  );
}

export default CrashReportMetrics;
