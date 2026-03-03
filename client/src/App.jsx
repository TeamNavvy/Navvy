import { BrowserRouter } from "react-router-dom";
import { Router } from "./router/Router";
import { extendTheme, ChakraProvider } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "orange.100",
        maxW: "1280px",
        margin: "0 auto",
        padding: "2rem",
        textAlign: "center",
      },
    },
  },
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Router></Router>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
