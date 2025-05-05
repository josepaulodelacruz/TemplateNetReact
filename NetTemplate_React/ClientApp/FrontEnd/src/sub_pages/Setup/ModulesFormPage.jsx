import {
  Button,
  Title,
  Text,
  UnstyledButton,
  Group,
  Center,
  Card,
  Container,
  TextInput,
  Space,
  Select,
  Loader,
  Skeleton
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import ErrorElement from "~/components/ErrorElement";
import useGetModuleItemById from "~/hooks/Setup/Modules/useGetModuleItemById";
import useGetModuleItems from "~/hooks/Setup/Modules/useGetModuleItems";
import useModuleItemsAddMutation from "~/hooks/Setup/Modules/useModuleItemsAddMutation";
import { useQueryClient } from "@tanstack/react-query";
import QueryKeys from "~/Constants/QueryKeys";

const SelectModule = ({ form }) => {
  const { data, isLoading, isError, isSuccess } = useGetModuleItems();
  const [selections, setSelections] = useState([]);

  useEffect(() => {
    if (isSuccess) {
      setSelections(() => {
        const items = data.body?.map((item) => {
          return {
            value: item.id.toString(),
            label: item.name,
          }
        })

        return items;
      })
    }
  }, [isSuccess])

  if (isError) {
    return <ErrorElement >Something went wrong!</ErrorElement>
  }

  return (
    <Select
      key={form.key('parent_id')}
      label="Parent Module"
      data={selections}
      rightSection={isLoading ? <Loader size={'sm'} /> : null}
      {...form.getInputProps('parent_id')}
    />
  )
}

const ModulesFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isError, isSuccess, isLoading, error } = useGetModuleItemById();
  const addModuleMutation = useModuleItemsAddMutation();
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: null,
      parent_id: null
    }
  });

  useEffect(() => {
    if (id === undefined) {
      queryClient.invalidateQueries([QueryKeys.MODULE_ITEM_ID]);
      form.reset();
    }
  }, [id])

  useEffect(() => {
    if (isSuccess) {
      form.reset();
      form.setValues(data.body[0]);
    }
  }, [isLoading])

  const handleSubmit = (e) => {
    e.preventDefault();

    return id === undefined ? 
      onManageAdd() :
      onManageEdit();
  }

  const onManageAdd = () => {
    addModuleMutation.mutate(form.getValues(), {
      onSuccess: (response) => {
        notifications.show({
          color: 'green',
          title: "Success",
          message: response.message
        });

        setTimeout(() => {
          navigate(-1);
        }, 500)
      },
      onError: (error) => {
        notifications.show({
          color: 'red',
          title: "Failed Attempt!",
          message: error.response.data?.message || error.message
        })
      }
    })
  }

  const onManageEdit = () => {
    

  }

  return (
    <>
      <Group>
        <UnstyledButton onClick={() => navigate(-1)} p={0} m={0}>
          <ArrowLeft />
        </UnstyledButton>
        <Title component={'span'} style={{ viewTransitionName: 'mdl-header' }} size={50} fw={700}>Modules</Title>
      </Group>
      <Text size={'sm'}>Add new module</Text>
      {
        isError ?
          <ErrorElement>{error.response.data?.message || error.message}</ErrorElement>
          : <Center>
            <Container w={'30rem'} mt={30} >
              <form onSubmit={handleSubmit}>
                <Card shadow="sm">
                  <Text fw={700}>Add New Module</Text>
                  <Space h={'sm'} />
                  <TextInput
                    withAsterisk
                    size="lg"
                    key={form.key('name')}
                    required
                    placeholder="Enter module name"
                    label="Module Name"
                    rightSection={isLoading ? <Loader size="xs" /> : null}
                    {...form.getInputProps('name')}
                  />
                  <Space h={'sm'} />
                  <SelectModule
                    form={form}
                  />

                  <Space h={'sm'} />
                  <Group justify="flex-end">
                    <Button onClick={() => navigate(-1)} variant="outline" color="default">
                      Cancel
                    </Button>
                    <Button type="submit">
                      Add
                    </Button>
                  </Group>
                </Card>
              </form>
            </Container>
          </Center>
      }
    </>
  )
}

export default ModulesFormPage;
