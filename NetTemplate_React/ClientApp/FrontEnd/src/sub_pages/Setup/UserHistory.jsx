import {
  Container,
  Timeline,
  Text,
  Paper,
  Collapse,
  Loader,
  Center,
  JsonInput,
  CheckIcon,
  CloseIcon,
  Pagination,
  Group,
  Code
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import moment from "moment";
import { useEffect } from "react";
import { useParams } from "react-router";
import ErrorElement from "~/components/ErrorElement";
import useGetUserHistoryById from "~/hooks/Setup/History/useGetUserHistoryById";
import usePagination from "~/hooks/Setup/History/usePagination"

const CollapsibleHistory = ({ item }) => {
  const [opened, { toggle }] = useDisclosure(false);

  const isError = item.responseStatusCode <= 200 || item.responseStatusCode > 400;

  return (
    <Timeline.Item bullet={isError ? <CheckIcon color="teal" size={12} /> : <CloseIcon color="red" />} onClick={toggle} style={{ cursor: 'pointer' }} >
      <Paper shadow="none">
        <Text size="sm">{item.requestMethod} <Text variant="link" component="span">{item.requestPath} </Text>
          <Text size="sm" component="span" c="dimmed">{item.duration}s</Text>
        </Text>
        <Text size="xs" c="dimmed">REF ID: {item.id}</Text>
        <Text c="dimmed" size="xs" mt={4}>
          <Text component="span" c={isError ? 'teal' : 'red'}>status: {item.responseStatusCode} </Text>
          {moment(item.timestamp).calendar()}
        </Text>
        <Collapse in={opened} >
          <JsonInput
            size="xs"
            description="Response"
            value={item.body}
            autosize={true}
            formatOnBlur
          />
        </Collapse>
      </Paper>
    </Timeline.Item>
  )
}

const UserLogs = ({ page = 1 }) => {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useGetUserHistoryById(id, page);

  if (isLoading) {
    return (
      <Container fluid>
        <Center>
          <Loader />
        </Center>
      </Container>
    )
  }

  if (isError) {
    return (
      <ErrorElement>
        {error.response.data.message || error.message}
      </ErrorElement>
    )
  }

  return (
    <>
      <Timeline active={0} bulletSize={24} lineWidth={2}>
        {
          data.body?.map((item, index) => {
            return (
              <CollapsibleHistory key={index} item={item} />
            )
          })
        }
      </Timeline>
    </>
  )
}

const UserHistory = () => {
  const { id } = useParams();
  const { page, onSetPage, totalPages, onSetTotalPage } = usePagination();
  const { isSuccess, data } = useGetUserHistoryById(id)

  useEffect(() => {
    if (isSuccess) {
      onSetTotalPage(data?.body[0]?.totalPages ?? 0);
    }
  }, [isSuccess, data])


  return (
    <Container fluid>
      <Group justify="end" mb={20}>
        <Pagination onChange={onSetPage} total={totalPages} boundaries={2} />
      </Group>
      <UserLogs
        page={page} />
    </Container>
  )
}

export default UserHistory;
