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
import { AppleIcon } from 'lucide-react';

const CrashReportCard = ({
  report = null
}) => {

  const ReportCoverPhoto = () => {
    if (!report.image_cover) return
    return <Image 
      h={"100%"}
      w="100%"
      fit="cover"
      src={`data:image/png;base64,${report.image_cover}`}/>
  }

  return (
    <Paper shadow="xs" m={0} p={0}>
      <Box w={{ base: '100%', md: '350' }} >
        <Box h="250" bg="primary">
          <ReportCoverPhoto />
        </Box>
        <Box p={10}>
          <Flex direction={"row"} justify="space-between" align="center">
            <Flex direction="column" >
              <Text size="xs" fw={300} c="dimmed" >Reported by: <Text fw={600} span size="xs" inherit>delacruzjosepaulo@gmail.com</Text> </Text>
              <Text size="xs" fw={300} c="dimmed" >Date: <Text fw={600} span size="xs" inherit>March 3rd, 2025 4:50 pm</Text> </Text>
            </Flex>
            <Badge color="yellow" size="xs">Medium</Badge>
          </Flex>
          <Divider my={5} />
          <Group justify='space-between'>
            <Text size="xs" c="dimmed">Reference ID: <Text span>29231</Text> </Text>
            <Badge variant='light'>Edge</Badge>
          </Group>
          <Group my={12}>
            <Badge variant='dot'><Text size="xs" inherit c="dimmed">Windows 10</Text></Badge>
          </Group>
          <Text lineClamp={2} size="xs">Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis.</Text>
          <Group justify="end" mt={5}>
            <Button variant="subtle" size="compact-xs">
              See more...
            </Button>
          </Group>
        </Box>
      </Box>
    </Paper>
  )
}

export default CrashReportCard;
