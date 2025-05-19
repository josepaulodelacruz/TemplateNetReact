import {
  Container,
  Timeline,
  Text,
  Paper,
  Collapse
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";


const CollapsibleHistory = () => {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <Timeline.Item onClick={toggle} style={{cursor: 'pointer'}} >
      <Paper shadow="none">
        <Text c="dimmed" size="sm">You&apos;ve created new branch <Text variant="link" component="span" inherit>fix-notifications</Text> from master</Text>
        <Text size="xs" mt={4}>2 hours ago</Text>
        <Collapse in={opened} >
          <Text>Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis.</Text>
        </Collapse>
      </Paper>
    </Timeline.Item>
  )
}

const UserHistory = () => {
  return (
    <Container fluid>
      <Timeline active={1} bulletSize={24} lineWidth={2}>
        <CollapsibleHistory />
        <CollapsibleHistory />
        <CollapsibleHistory />
        <CollapsibleHistory />
        <CollapsibleHistory />
        <CollapsibleHistory />
        <CollapsibleHistory />
      </Timeline>
    </Container>
  )
}

export default UserHistory;
