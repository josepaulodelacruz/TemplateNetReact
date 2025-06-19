import { LineChart } from '@mantine/charts';
import { Box, Card, Center, Flex, Paper, Text, Title } from '@mantine/core'
import { Boxes, LucideBoxes } from 'lucide-react';
import moment from 'moment';
import { useEffect, useState } from 'react';

const data22 = [
  {
    date: 'Mar 22',
    Low: 2890,
    Medium: 2338,
    High: 2452,
    Critical: 1230,
  },
  {
    date: 'Mar 23',
    Low: 2756,
    Medium: 2103,
    High: 2402,
    Critical: 0,
  },
  {
    date: 'Mar 24',
    Low: 3322,
    Medium: 986,
    High: 1821,
    Critical: 500,
  },
  {
    date: 'Mar 25',
    Low: 3470,
    Medium: 2108,
    High: 2809,
    Critical: 800,
  },
  {
    date: 'Mar 26',
    Low: 3129,
    Medium: 1726,
    High: 2290,
    Critical: 0,
  },
];

const CrashReportLineChart = ({ lineCharts = [] }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const dates = lineCharts?.map((item) => {
      const date = moment(item.date).format("MMM D");
      return {
        ...item,
        date,
      };
    });
    setData(dates);
  }, [lineCharts]);

  return (
    <Paper shadow="xs" w="100%" h={{ base: '250px', md: '100%' }}>
      {!data || data.length === 0 ? (
        <Card shadow='xs' h="100%" >
          <Flex direction="column" justify="center" align="center" h="100%" w="100%">
            <Text component={'span'} fw={500} size="lg" c="dimmed">No Data to Show.</Text>
            <Boxes size={120} />
          </Flex>
        </Card>
      ) : (
        <LineChart
          h="100%"
          data={data}
          dataKey="date"
          series={[
            { name: 'daily_affected_users', color: 'green' },
            { name: 'daily_crashes', color: 'orange' },
            { name: 'daily_critical_crashes', color: 'red' },
          ]}
          curveType="linear"
          tickLine="none"
          gridAxis="none"
        />
      )
      }
    </Paper >
  );
};


export default CrashReportLineChart;
