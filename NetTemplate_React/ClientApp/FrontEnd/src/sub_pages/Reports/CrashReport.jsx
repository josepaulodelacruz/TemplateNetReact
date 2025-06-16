import { Button, Container, Flex, Text, Group, Paper, Stack, ThemeIcon, Title, Space, Box, MultiSelect, Pagination, Loader } from "@mantine/core";
import { useEffect, useState } from "react";
import CrashReportCard from "./components/CrashReportCard";
import useCrashReportFetch from "~/hooks/Reports/useCrashReportsFetch";
import ErrorElement from "~/components/ErrorElement";
import useCrashReport from "~/hooks/CrashReport/useCrashReport";
import { notificationWithCrashReportButton } from "~/utils/notification";
import { useLocation } from "react-router";
import useAuth from "~/hooks/Auth/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import CrashReportMetrics from "./components/CrashReportMetrics";


const CrashReportCardSection = ({
  filters = [],
  page = 1
}) => {
  const { data, isLoading, isError, error, refetch } = useCrashReportFetch(page, filters)
  const { onTriggerCrashReportModal } = useCrashReport();
  const { pathname } = useLocation()
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    refetch();
  }, [filters])

  useEffect(() => {
    if (isError) {
      notificationWithCrashReportButton({
        color: 'red',
        title: "Failed",
        message: error.message,
        onClick: () => {
          onTriggerCrashReportModal({
            error: error,
            pathname: pathname,
            userAgent: user.agent,
          });
        }
      })
    }
  }, [isError])

  if (isLoading) {
    return (
      <Group justify="center">
        <Loader type="dots" />
      </Group>
    )
  }

  if (isError) {
    return <ErrorElement >Something went wrong..</ErrorElement>
  }

  return (
    <Flex wrap="wrap" gap="md">
      {
        data?.body !== undefined && Array.isArray(data.body) && data.body?.map((report, index) => {
          return (
            <Box key={index} style={{ flexBasis: 'calc(25% - 12px)', minWidth: '300' }}>
              <CrashReportCard queryClient={queryClient} report={report} />
            </Box>
          )
        })
      }
    </Flex>
  )
}

const CrashReport = () => {
  const [range, setRange] = useState('today')
  const [page, onChange] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const { data, isSuccess } = useCrashReportFetch(page)
  const { onTriggerCrashReportModal, filterSeverity, setFilterSeverity } = useCrashReport();

  useEffect(() => {
    if (isSuccess) {
      setTotalPage(data?.body[0]?.total_pages);
    }
  }, [isSuccess, data])

  const handleFilterRange = (val) => {
    setRange(val);
  }

  const handleTestError = () => {
    try {
      onChange('test');
    } catch (err) {
      onTriggerCrashReportModal({
        pathname: pathname,
        userAgent: user.agent,
      });

    }
  }

  return (
    <Container fluid>
      <Group>
        <Title component={'span'} size={50} fw={700} >Crash Reports</Title>
      </Group>

      <Group justify="space-between">
        <Button.Group my={12} size="compact-xs">
          <Button onClick={() => handleFilterRange('today')} variant={range === 'today' ? 'light' : 'default'}>Today</Button>
          <Button onClick={() => handleFilterRange('yesterday')} variant={range === 'yesterday' ? 'light' : 'default'} >Yesterday</Button>
          <Button onClick={() => handleFilterRange('week')} variant={range === 'week' ? 'light' : 'default'}>Week</Button>
          <Button onClick={() => handleFilterRange('month')} variant={range === 'month' ? 'light' : 'default'} >Month</Button>
          <Button onClick={() => handleFilterRange('all')} variant={range === 'all' ? 'light' : 'default'} >All Time</Button>
        </Button.Group>
        <Button variant="outline" color="red" onClick={handleTestError}>
          Test error
        </Button>
      </Group>

      <CrashReportMetrics />

      <Space h={15} />

      <Group justify="start">
        <Box w={{ base: '100%', md: 400 }} py={20}>
          <MultiSelect
            clearable
            placeholder="Filter"
            onChange={setFilterSeverity}
            value={filterSeverity}
            data={['Low', 'Medium', 'High', 'Critical']}
            comboboxProps={{ position: 'bottom', middlewares: { flip: false, shift: false }, offset: 0 }}
          />
        </Box>
      </Group>
      <CrashReportCardSection filters={filterSeverity} page={page} />
      <Group justify="end">
        <Box py={20}>
          <Pagination onChange={onChange} total={totalPage} boundaries={2} />
        </Box>
      </Group>
    </Container>
  )
}

export default CrashReport;
