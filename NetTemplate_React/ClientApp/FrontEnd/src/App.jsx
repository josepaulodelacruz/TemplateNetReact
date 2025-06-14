import { MantineProvider } from "@mantine/core";
import Router from "./Router"
import '@mantine/notifications/styles.css';
import { ScrollRestoration } from "react-router";

const App = () => {
  return (
    <>
      <Router />
    </>
  )
}


export default App
