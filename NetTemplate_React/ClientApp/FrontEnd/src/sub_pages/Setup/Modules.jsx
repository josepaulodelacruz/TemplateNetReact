import { Container, Text, Title } from "@mantine/core";
import { Outlet, useLocation } from "react-router";

const Modules = () => {
  const { pathname } = useLocation();
  const paths = pathname.split('/').splice(2,3,99) // get only the sub modules 

  
  return (
    <Container fluid>
      <Outlet/>
    </Container>
  )
}

export default Modules;
