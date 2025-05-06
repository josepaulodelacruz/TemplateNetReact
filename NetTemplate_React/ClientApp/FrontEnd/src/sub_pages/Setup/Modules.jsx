import { Container } from "@mantine/core";
import { Outlet } from "react-router";

const Modules = () => {
  
  return (
    <Container fluid>
      <Outlet/>
    </Container>
  )
}

export default Modules;
