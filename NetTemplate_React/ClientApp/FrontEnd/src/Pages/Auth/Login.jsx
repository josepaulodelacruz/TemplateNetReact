import {
  Container,
  Button,
  Text,
  Title,
  Group,
  Flex,
  Stack,
  TextInput,
  Space,
  Checkbox,
  Divider,
} from "@mantine/core";
import { HomeIcon, LockIcon, Mail, PhoneCall, UserIcon } from "lucide-react";

const formWidth = {
  sm: '100%',
  md: 500,
}

const Login = () => {
  return (
    <Container h={'100vh'} >
      <Flex direction={"column"} h={"80%"} align="center" justify="center">

        <Group justify="center" align="center">
          <HomeIcon />
          <Title fw={500}>Default Name</Title>
        </Group>
        <Flex direction="column" >
          <Title style={{textAlign: 'center'}} size={50} fw={800}>Welcome Back</Title>
          <Text style={{textAlign: 'center'}}>Sign in using your account.</Text>

          <Space h="lg" />
          <TextInput
            size="lg"
            leftSection={<Mail />}
            label="Username"
            placeholder="Enter your username"
            w={formWidth} />

          <Space h="lg" />
          <TextInput
            label="Password"
            placeholder="Enter your password"
            size="lg"
            leftSection={<LockIcon />}
            w={formWidth} />

          <Space h="lg" />
          <Group w={formWidth} justify="start">
            <Checkbox label="Remember Me" />
          </Group>

          <Button fullWidth w={formWidth} mt={20} size="lg" radius="md" >
            Login
          </Button>

          <Divider  my="md" label={<Text>Don't have an account?</Text>} labelPosition="center" />

          <Button fullWidth leftSection={<PhoneCall />} w={formWidth} variant="outline" mt={20} size="lg" radius="md" >
            Request Access to IT
          </Button>


        </Flex>
      </Flex>
    </Container>
  )
}


export default Login;

