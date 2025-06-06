import { LineChart } from '@mantine/charts';
import { Paper } from '@mantine/core'

const data = [
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

const CrashReportLineChart = () => {
  return (
    <Paper shadow="xs" w={'100%'} h={{ base: '250px', md: '100%' }}>
      <LineChart
        h={"100%"}
        data={data}
        dataKey="date"
        series={[
          { name: 'Low', color: 'green' },
          { name: 'Medium', color: 'yellow' },
          { name: 'High', color: 'orange' },
          { name: 'Critical', color: 'red' },
        ]}
        curveType="linear"
        tickLine="none"
        gridAxis="none"
      />

    </Paper>


  )

}

export default CrashReportLineChart;
