import { BrowserRouter } from "react-router-dom";
import { Router } from "./router/Router";
import { extendTheme, ChakraProvider } from "@chakra-ui/react";
import "./App.css";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "orange.100",
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
