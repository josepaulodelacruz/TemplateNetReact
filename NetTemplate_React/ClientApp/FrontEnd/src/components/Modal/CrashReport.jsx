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
import { useForm } from '@mantine/form';
import { AlertTriangle, Bug, Clock, Copy, Mail, MapPin, Monitor, X, RotateCcw, Send, User, Info, Trash, } from 'lucide-react';
import { useState } from 'react';
import useAuth from '~/hooks/Auth/useAuth';
import useCrashReport from '~/hooks/CrashReport/useCrashReport';
import moment from 'moment'
import useCrashReportAddMutation from '~/hooks/CrashReport/useCrashReportAddMutation';
import { severityColors } from '~/constants/data';
import { notifications } from '@mantine/notifications';
import CrashReportTimelineCard from '~/sub_pages/Reports/components/CrashReportTimelineCard';

const FormReport = ({
  error = null,
  onChangeSeverity,
  severity = "medium"
}) => {
  const { onCloseCrashReportModal } = useCrashReport();
  const [pastedImages, setPastedImages] = useState([]);
  const addReportMutation = useCrashReportAddMutation();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      severity: severity,
      scenario: '',
      details: '',
      when: '',
      where: '',
      what: '',
      stackTrace: '',
      browser: '',
      os: '',
      userAgent: '',
      images: null,

    },
    validate: {
      email: (value) => {
        if (!value) return 'Email is required';
        if (!/^\S+@\S+$/.test(value)) return 'Invalid email format';
        return null;
      },
      scenario: (value) => {
        if (!value || value.trim().length === 0) return 'Please describe what you were doing when this happened';
        if (value.trim().length < 10) return 'Please provide more details (at least 10 characters)';
        return null;
      },
      details: (value) => {
        if (!value || value.trim().length === 0) return 'Steps to reproduce are required';
        if (value.trim().length < 15) return 'Please provide more detailed steps (at least 15 characters)';
        return null;
      }
    },
    validateInputOnBlur: true,
    validateInputOnChange: true,
  })

  function base64ToBlob(base64, mime = 'image/png') {
    const byteString = atob(base64.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const intArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }

    return new Blob([intArray], { type: mime });
  }

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

  const handleSubmit = async (values) => {
    // Validate form before submission
    const validation = form.validate();
    if (validation.hasErrors) {
      return;
    }

    // Set additional values from error object
    const submissionData = {
      ...values,
      when: error?.when || '',
      where: error?.where || '',
      what: error?.what || '',
      severity: severity,
      stackTrace: error?.stackTrace || '',
      browser: error?.userAgent?.["Browser"] || '',
      os: error?.userAgent?.["Operating System"] || '',
      userAgent: error?.userAgent?.["Operating System"] || '',
      images: pastedImages,
    };

    const formData = new FormData();

    formData.append("when", submissionData.when);
    formData.append("where", submissionData.where);
    formData.append("what", submissionData.what);
    formData.append("SeverityLevel", submissionData.severity);
    formData.append("stackTrace", submissionData.stackTrace);
    formData.append("browser", submissionData.browser);
    formData.append("os", submissionData.os);
    formData.append("UserAgent", submissionData.userAgent);
    formData.append("details", submissionData.details);
    formData.append("scenario", submissionData.scenario);
    formData.append("email", submissionData.email);
    formData.append("logId", error.error?.response?.data?.reference_id);

    // Append each image to formData
    pastedImages.forEach((image, index) => {
      const blob = base64ToBlob(image.src);
      formData.append('Images', blob, image.name || `file${index}.png`);
    });

    await onManageSubmitReport(formData);

  }

  const onManageSubmitReport = async (formData) => {
    await addReportMutation.mutateAsync(formData, {
      onSuccess: (response) => {
        notifications.show({
          color: 'green',
          title: "Success",
          message: response.message,
        });
        form.reset();
        setPastedImages([]);
        onCloseCrashReportModal();
      },
      onError: (error) => {
        notifications.show({
          color: "red",
          title: "Ooops",
          message: error.message
        })
      }
    })
  }

  const changeSeverityLevel = (e) => {
    form.setFieldValue('severity', e);
    onChangeSeverity(e);
  }

  const resetForm = () => {
    form.reset();
    setPastedImages([]);
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        <TextInput
          withAsterisk
          label="Email Address"
          placeholder='your.email@example.com'
          leftSection={<Mail size={16} />}
          description="We'll notify you when this issue is resolved"
          key={form.key('email')}
          {...form.getInputProps('email')}
        />

        <Select
          allowDeselect={false}
          label="Severity Level"
          value={severity}
          onChange={changeSeverityLevel}
          data={[
            { value: 'low', label: '🟢 Low - Minor inconvenience' },
            { value: 'medium', label: '🟡 Medium - Affects functionality' },
            { value: 'high', label: '🟠 High - Blocks important features' },
            { value: 'critical', label: '🔴 Critical - App unusable' }
          ]}
          description="How severely does this issue affect your work?"
        />

        <Textarea
          withAsterisk
          label="What were you doing when this happened?"
          description="Input the scenario of what you were doing. IMAGES (optional) *Copy paste the Image from your clipboard*"
          placeholder="Describe what you were trying to do when the error occurred (minimum 10 characters)"
          onPaste={handlePaste}
          minRows={4}
          key={form.key('scenario')}
          {...form.getInputProps('scenario')}
        />

        {pastedImages.length > 0 && (
          <div>
            <Text size="sm" fw={500} mb="xs">Pasted Images:</Text>
            <Group>
              {pastedImages.map((img, index) => (
                <Box key={index} style={{
                  position: 'relative',
                  width: 100,
                  height: 100
                }}>
                  <Button
                    onClick={() => {
                      setPastedImages((state) => {
                        const _state = state.filter((_, i) => i != index);
                        return _state;
                      })
                    }}
                    style={{
                      position: 'absolute',
                      top: 5,
                      left: '65%',
                      zIndex: 1,
                    }}
                    size="xs"
                    color="red"
                    variant='transparent'
                  >
                    <Trash size={18} />
                  </Button>

                  <Image
                    src={img.src}
                    alt={img.name}
                    width={100}
                    height={100}
                    fit="contain"
                    style={{
                      position: 'relative',
                      zIndex: 0,
                    }}
                  />
                </Box>
              ))}
            </Group>
          </div>
        )}

        <Textarea
          required
          withAsterisk
          label="Steps to Reproduce"
          description="Help us reproduce this issue by providing the data inputs or step-by-step instructions (minimum 15 characters)"
          placeholder="1. Go to Products page&#10;2. Click on 'Load More' button&#10;3. Error appears..."
          minRows={3}
          maxRows={6}
          key={form.key('details')}
          {...form.getInputProps('details')}
        />
      </Stack>

      {/* Action Buttons */}
      <Group justify="space-between" pt="md">
        <Group>
          <Button
            onClick={onCloseCrashReportModal}
            variant="subtle"
            color="gray"
            leftSection={<X size={16} />}
          >
            Close
          </Button>
          <Button
            onClick={resetForm}
            variant="light"
            color="blue"
            leftSection={<RotateCcw size={16} />}
          >
            Reset Form
          </Button>
        </Group>

        <Button
          type="submit"
          leftSection={<Send size={16} />}
          loaderProps={{ type: 'dots' }}
          loading={addReportMutation.isLoading}
          disabled={!form.isValid()}
        >
          Send Report
        </Button>
      </Group>
    </form>
  )
}

const CrashReport = () => {
  const { errorDetails, isCrashReportModal, onCloseCrashReportModal } = useCrashReport();
  const [severity, setSeverity] = useState('medium');
  const { user } = useAuth();

  return (
    <>
      <Modal size="xl" opened={isCrashReportModal} onClose={onCloseCrashReportModal} withCloseButton={false} >
        <Stack gap="lg">
          <Group gap="sm">
            <ThemeIcon size="lg" color="red" variant='light' >
              <Bug size={20} />
            </ThemeIcon>
            <Container p={0} m={0}>
              <Title order={3}>Crash Report</Title>
              <Text size="sm" c="dimmed">Help us fix this issue</Text>
            </Container>
          </Group>

          <Alert
            icon={<AlertTriangle size={20} />}
            color="red" variant="light"
            title="Application Crashed"
          >
            <Text size="sm">
              We detected an unexpected error in your application. Your report helps us improve the experience for everyone.
            </Text>
          </Alert>

          <CrashReportTimelineCard errorDetails={errorDetails} severity={severity}/>

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
                    <CopyButton value={errorDetails.stackTrace}>
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
                    {errorDetails.stackTrace}
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
                    <Text size="sm">{user.agent.Browser}</Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text size="sm" fw={500}>Operating System:</Text>
                    <Text size="sm">{user.agent["Operating System"]}</Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text size="sm" fw={500}>User Agent:</Text>
                    <Text size="sm" style={{ wordBreak: 'break-all' }}>
                      {user.agent["User Agent"]}
                    </Text>
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

          <FormReport
            severity={severity}
            onChangeSeverity={setSeverity}
            error={errorDetails} />

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
