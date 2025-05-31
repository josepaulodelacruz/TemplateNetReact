import {
  Modal,
  ThemeIcon,
  Container,
  Title,
  Text,
  Group,
  Alert,
  Stack,
  Card,
  Box,
  Badge,
  Timeline,
  Accordion,
  Paper,
  CopyButton,
  Tooltip,
  ActionIcon,
  Code,
  Flex,
  Divider,
  TextInput,
  Select,
  Textarea,
  Image,
  Button

} from '@mantine/core'
import { AlertTriangle, Bug, Clock, Copy, Mail, MapPin, Monitor, X, RotateCcw, Send, User, Info, } from 'lucide-react';
import { useState } from 'react';
import useCrashReport from '~/hooks/CrashReport/useCrashReport';


const crashData = {
  errorId: 'CR-2025-0530-001',
  timestamp: new Date().toISOString(),
  errorType: 'TypeError',
  errorMessage: 'Cannot read property \'map\' of undefined',
  stackTrace: `TypeError: Cannot read property 'map' of undefined
    at ProductList.render (ProductList.jsx:42:18)
    at ReactDOMComponent.render (react-dom.js:1234:56)
    at Component.performUnitOfWork (react-reconciler.js:789:12)
    at workLoop (scheduler.js:456:23)
    at flushWork (scheduler.js:398:11)`,
  url: 'https://myapp.com/products',
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  browserInfo: {
    name: 'Chrome',
    version: '122.0.6261.112',
    os: 'Windows 10'
  },
  sessionInfo: {
    userId: 'user_12345',
    sessionId: 'sess_abc123',
    duration: '15:42'
  }
};

const severityColors = {
  low: 'green',
  medium: 'yellow',
  high: 'orange',
  critical: 'red'
}

const CrashReport = () => {
  const [severity, setSeverity] = useState('medium');
  const { isCrashReportModal, onCloseCrashReportModal } = useCrashReport();
  const [value, setValue] = useState('');
  const [pastedImages, setPastedImages] = useState([]);

  const handlePaste = async (event) => {
    const clipboardItems = event.clipboardData.items;

    for (let i = 0; i < clipboardItems.length; i++) {
      const item = clipboardItems[i];

      if (item.type.indexOf('image') !== -1) {
        event.preventDefault();
        const file = item.getAsFile();

        // Convert to base64 for display
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageData = {
            id: Date.now() + i,
            src: e.target.result,
            name: file.name || `image-${Date.now()}`
          };
          setPastedImages(prev => [...prev, imageData]);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <>
      <Modal size="xl" opened={isCrashReportModal} onClose={onCloseCrashReportModal} title={
        <Group gap="sm">
          <ThemeIcon size="lg" color="red" variant='light' >
            <Bug size={20} />
          </ThemeIcon>
          <Container p={0} m={0}>
            <Title order={3}>Crash Report</Title>
            <Text size="sm" c="dimmed">Help us fix this issue</Text>
          </Container>
        </Group>
      }>
        <Stack gap="lg">
          <Alert
            icon={<AlertTriangle size={20} />}
            color="red" variant="light"
            title="Application Crashed"
          >
            <Text size="sm">
              We detected an unexpected error in your application. Your report helps us improve the experience for everyone.
            </Text>
          </Alert>

          <Card withBorder radius="md" p="lg">
            <Group justify='space-between' mb="lg" >
              <Group>
                <ThemeIcon color="red" variant='light'>
                  <Bug size={18} />
                </ThemeIcon>
                <Box>
                  <Text fw={600}>Error Details</Text>
                  <Text size="sm" c="dimmed">ID: 4021</Text>
                </Box>
              </Group>
              <Badge color={severityColors.medium} size="sm" variant='light'>
                Medium
              </Badge>
            </Group>
            <Timeline active={-1} bulletSize={24} lineWidth={2}>
              <Timeline.Item
                bullet={<Clock size={12} />}
                title="When"
              >
                <Text size="sm" c="dimmed">5/31/2025, 8:33:13 AM</Text>
              </Timeline.Item>
              <Timeline.Item
                bullet={<MapPin size={12} />}
                title="Where"
              >
                <Text size="sm" c="dimmed">/dashboard</Text>
              </Timeline.Item>
              <Timeline.Item
                bullet={<AlertTriangle size={12} />}
                title="What"
              >
                <Text size="sm" c="dimmed">TypeError: Cannot read property 'map' of undefined</Text>
              </Timeline.Item>
            </Timeline>
          </Card>

          {/*Technical details*/}
          <Accordion variant="contained" radius="md">
            <Accordion.Item value="stack-trace">
              <Accordion.Control icon={<Bug size={20} />}>
                Stack Trace
              </Accordion.Control>
              <Accordion.Panel>
                <Paper p="sm" bg="gray.0" radius="sm">
                  <Group justify="space-between" mb="xs">
                    <Text size="sm" fw={500}>Error Stack</Text>
                    <CopyButton value={crashData.stackTrace}>
                      {({ copied, copy }) => (
                        <Tooltip label={copied ? 'Copied' : 'Copy'}>
                          <ActionIcon
                            color={copied ? 'teal' : 'gray'}
                            variant="subtle"
                            onClick={copy}
                          >
                            <Copy size={16} />
                          </ActionIcon>
                        </Tooltip>
                      )}
                    </CopyButton>
                  </Group>
                  <Code block>
                    {crashData.stackTrace}
                  </Code>
                </Paper>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="system-info">
              <Accordion.Control icon={<Monitor size={20} />}>
                System Information
              </Accordion.Control>
              <Accordion.Panel>
                <Stack gap="sm">
                  <Flex justify="space-between">
                    <Text size="sm" fw={500}>Browser:</Text>
                    <Text size="sm">{crashData.browserInfo.name} {crashData.browserInfo.version}</Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text size="sm" fw={500}>Operating System:</Text>
                    <Text size="sm">{crashData.browserInfo.os}</Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text size="sm" fw={500}>User Agent:</Text>
                    <Text size="sm" style={{ wordBreak: 'break-all' }}>
                      {crashData.userAgent}
                    </Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text size="sm" fw={500}>Session Duration:</Text>
                    <Text size="sm">{crashData.sessionInfo.duration}</Text>
                  </Flex>
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>

          <Divider />
          {/*User feedback*/}
          <Group mb="md">
            <ThemeIcon color="blue" variant='light'>
              <User size={20} />
            </ThemeIcon>
            <Box>
              <Text fw={600}>Help Us Fix This</Text>
              <Text size="sm" c="dimmed">Additional information helps us resolve issues faster</Text>
            </Box>
          </Group>

          <Stack gap="md">
            <TextInput
              label="Email Address"
              placeholder='your.email@example.com'
              leftSection={<Mail size={16} />}
              description="We'll notifiy you when this issue is resolved"
            />
            <Select
              label="Severity Level"
              value={severity}
              onChange={setSeverity}
              data={[
                { value: 'low', label: '🟢 Low - Minor inconvenience' },
                { value: 'medium', label: '🟡 Medium - Affects functionality' },
                { value: 'high', label: '🟠 High - Blocks important features' },
                { value: 'critical', label: '🔴 Critical - App unusable' }
              ]}
              description="How severely does this issue affect your work?"
            />
          </Stack>

          <Textarea
            label="What were you doing when this happened?"
            description="Input the scenario of what you were doing. IMAGES (optional) *Copy paste the Image from your clipboard*"
            placeholder="Describe what you were trying to do when the error occured"
            value={value}
            onChange={(event) => setValue(event.currentTarget.value)}
            onPaste={handlePaste}
            minRows={4}
          />
          {pastedImages.length > 0 && (
            <div>
              <Text size="sm" fw={500} mb="xs">Pasted Images:</Text>
              <Group>
                {pastedImages.map((img) => (
                  <Image
                    key={img.id}
                    src={img.src}
                    alt={img.name}
                    width={100}
                    height={100}
                    fit="cover"
                  />
                ))}
              </Group>
            </div>
          )}

          <Textarea
            label="Steps to Reproduce (Optional)"
            description="Help us reproduce this issue by providing the data inputs or step-by-step instructions"
            placeholder="1. Go to Products page&#10;2. Click on 'Load More' button&#10;3. Error appears..."
            minRows={3}
            maxRows={6}
          />

          {/* Action Buttons */}
          <Group justify="space-between" pt="md">
            <Group>
              <Button
                variant="subtle"
                color="gray"
                leftSection={<X size={16} />}
              >
                Close
              </Button>
              <Button
                variant="light"
                color="blue"
                leftSection={<RotateCcw size={16} />}
              >
                Try Again
              </Button>
            </Group>

            <Button
              leftSection={<Send size={16} />}
              loaderProps={{ type: 'dots' }}
            >
              Send Report
            </Button>
          </Group>
          {/* Footer Info */}
          <Alert
            variant="light"
            color="blue"
            icon={<Info size={16} />}
          >
            <Text size="xs">
              This crash report will be sent to our development team to help improve the application.
              No personal data beyond what you provide will be included.
            </Text>
          </Alert>

        </Stack>
      </Modal >
    </>
  )
}

export default CrashReport;
