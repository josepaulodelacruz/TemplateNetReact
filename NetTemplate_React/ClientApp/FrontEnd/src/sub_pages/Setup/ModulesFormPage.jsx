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
} from "@mantine/core";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

const ModulesFormPage = () => {
  const navigate = useNavigate();

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
          <form>
            <Card >
              <Text fw={700}>Add New Module</Text>
              <Space h={'sm'}/>
              <TextInput 
                placeholder="Enter module name"
                label="Module Name"
              />
              <Space h={'sm'}/>
              <Group justify="flex-end">
                <Button onClick={() => navigate(-1)} variant="outline" color="default">
                  Cancel
                </Button>
                <Button>
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
