import { 
  Modal,
  Text,
  Stack,
  Group,
  Button,
  Textarea,
  TextInput,
  Alert,
  Card,
  Badge,
  Divider,
  ScrollArea,
  ActionIcon,
  CopyButton,
  Tooltip,
  Paper,
  Title,
  Accordion,
  Code,
  Flex,
  ThemeIcon,
  Timeline,
  Select
} from '@mantine/core';
import { 
  AlertTriangle, 
  Bug, 
  Copy, 
  Send, 
  User, 
  Mail, 
  Clock,
  Monitor,
  MapPin,
  RotateCcw,
  X,
  Check,
  Info
} from 'lucide-react';
import { useState } from 'react';

const CrashReport = () => {
  const [isCrashReportModal, setIsCrashReportModal] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [userDescription, setUserDescription] = useState('');
  const [reproductionSteps, setReproductionSteps] = useState('');
  const [severity, setSeverity] = useState('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onCloseCrashReportModal = () => setIsCrashReportModal(false);

  // Mock crash data
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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Auto close after 3 seconds
    setTimeout(() => {
      onCloseCrashReportModal();
    }, 3000);
  };

  const severityColors = {
    low: 'green',
    medium: 'yellow',
    high: 'orange',
    critical: 'red'
  };

  if (isSubmitted) {
    return (
      <Modal 
        opened={isCrashReportModal} 
        onClose={onCloseCrashReportModal} 
        title={
          <Group gap="sm">
            <ThemeIcon color="green" variant="light" size="lg">
              <Check size={20} />
            </ThemeIcon>
            <Title order={3}>Report Submitted</Title>
          </Group>
        }
        size="md"
        centered
      >
        <Stack gap="lg" align="center" py="xl">
          <Text size="lg" ta="center" c="green">
            Thank you for your bug report! 🎉
          </Text>
          <Text size="sm" ta="center" c="dimmed">
            Your report has been successfully submitted with ID: <Code>{crashData.errorId}</Code>
          </Text>
          <Text size="sm" ta="center" c="dimmed">
            Our team will investigate this issue and get back to you soon.
          </Text>
          <Button 
            variant="light" 
            color="green" 
            onClick={onCloseCrashReportModal}
            leftSection={<Check size={16} />}
          >
            Close
          </Button>
        </Stack>
      </Modal>
    );
  }

  return (
    <Modal 
      opened={isCrashReportModal} 
      onClose={onCloseCrashReportModal} 
      title={
        <Group gap="sm">
          <ThemeIcon color="red" variant="light" size="lg">
            <Bug size={20} />
          </ThemeIcon>
          <div>
            <Title order={3}>Crash Report</Title>
            <Text size="sm" c="dimmed">Help us fix this issue</Text>
          </div>
        </Group>
      }
      size="xl"
      scrollAreaComponent={ScrollArea.Autosize}
    >
      <Stack gap="lg">
        {/* Alert Banner */}
        <Alert 
          variant="light" 
          color="red" 
          icon={<AlertTriangle size={20} />}
          title="Application Crashed"
        >
          <Text size="sm">
            We detected an unexpected error in your application. Your report helps us improve the experience for everyone.
          </Text>
        </Alert>

        {/* Crash Summary Card */}
        <Card withBorder radius="md" p="lg">
          <Group justify="space-between" mb="md">
            <Group gap="sm">
              <ThemeIcon color="red" variant="light">
                <Bug size={18} />
              </ThemeIcon>
              <div>
                <Text fw={600}>Error Details</Text>
                <Text size="sm" c="dimmed">ID: {crashData.errorId}</Text>
              </div>
            </Group>
            <Badge color={severityColors[severity]} variant="light">
              {severity.toUpperCase()}
            </Badge>
          </Group>

          <Timeline active={-1} bulletSize={24} lineWidth={2}>
            <Timeline.Item 
              bullet={<Clock size={12} />} 
              title="When"
            >
              <Text size="sm" c="dimmed">
                {new Date(crashData.timestamp).toLocaleString()}
              </Text>
            </Timeline.Item>
            <Timeline.Item 
              bullet={<MapPin size={12} />} 
              title="Where"
            >
              <Text size="sm" c="dimmed">
                {crashData.url}
              </Text>
            </Timeline.Item>
            <Timeline.Item 
              bullet={<AlertTriangle size={12} />} 
              title="What"
            >
              <Text size="sm" c="dimmed">
                {crashData.errorType}: {crashData.errorMessage}
              </Text>
            </Timeline.Item>
          </Timeline>
        </Card>

        {/* Technical Details */}
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

        {/* User Feedback Form */}
        <div>
          <Group mb="md">
            <ThemeIcon color="blue" variant="light">
              <User size={18} />
            </ThemeIcon>
            <div>
              <Text fw={600}>Help Us Fix This</Text>
              <Text size="sm" c="dimmed">
                Additional information helps us resolve issues faster
              </Text>
            </div>
          </Group>

          <Stack gap="md">
            <TextInput
              label="Email Address"
              placeholder="your.email@example.com"
              value={userEmail}
              onChange={(event) => setUserEmail(event.currentTarget.value)}
              leftSection={<Mail size={16} />}
              description="We'll notify you when this issue is resolved"
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

            <Textarea
              label="What were you doing when this happened?"
              placeholder="Describe what you were trying to do when the error occurred..."
              value={userDescription}
              onChange={(event) => setUserDescription(event.currentTarget.value)}
              minRows={3}
              maxRows={6}
            />

            <Textarea
              label="Steps to Reproduce (Optional)"
              placeholder="1. Go to Products page&#10;2. Click on 'Load More' button&#10;3. Error appears..."
              value={reproductionSteps}
              onChange={(event) => setReproductionSteps(event.currentTarget.value)}
              minRows={3}
              maxRows={6}
              description="Help us reproduce this issue by providing step-by-step instructions"
            />
          </Stack>
        </div>

        {/* Action Buttons */}
        <Group justify="space-between" pt="md">
          <Group>
            <Button
              variant="subtle"
              color="gray"
              onClick={onCloseCrashReportModal}
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
            onClick={handleSubmit}
            loading={isSubmitting}
            leftSection={<Send size={16} />}
            loaderProps={{ type: 'dots' }}
          >
            {isSubmitting ? 'Sending Report...' : 'Send Report'}
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
    </Modal>
  );
};

export default CrashReport;
