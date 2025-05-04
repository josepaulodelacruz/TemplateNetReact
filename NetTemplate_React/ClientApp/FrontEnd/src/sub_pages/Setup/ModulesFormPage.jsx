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
  Loader
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ErrorElement from "~/components/ErrorElement";
import useGetModuleItems from "~/hooks/Setup/Modules/useGetModuleItems";
import useModuleItemsAddMutation from "~/hooks/Setup/Modules/useModuleItemsAddMutation";

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
  const navigate = useNavigate();
  const addModuleMutation = useModuleItemsAddMutation();
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: null,
      parent_id: null
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    //add module item
    onManageAdd();
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
        console.log(error);
        notifications.show({
          color: 'red',
          title: "Failed Attempt!",
          message: error.response.data?.message || error.message
        })
      }
    })

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
      <Center>
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
    </>
  )
}

export default ModulesFormPage;
