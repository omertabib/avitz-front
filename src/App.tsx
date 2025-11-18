import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  IconButton,
  HStack,
  Separator,
  Toast, Toaster,
} from "@chakra-ui/react";
import {toasterComp} from "./components/ui/toasterComp.ts"
import { FaMoon, FaSun, FaMicrophone } from "react-icons/fa";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { RecordingForm } from "./components/RecordingForm";
import { AdminDashboard } from "./components/AdminDashboard";
import { useColorMode, useColorModeValue } from "./components/ui/color-mode";
import {BsX} from "react-icons/bs";

function App() {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgGradient = useColorModeValue(
    "linear(to-b, blue.50, white)",
    "linear(to-b, gray.900, gray.800)"
  );

  return (
    <Router>
      <Toaster toaster={toasterComp} w={"md"} dir={"rtl"}>
        {(toast) => (
          <Toast.Root key={toast.id}>
            <Toast.Title>{toast.title}</Toast.Title>
            <Toast.Description>{toast.description}</Toast.Description>
            <Toast.CloseTrigger>
              <BsX />
            </Toast.CloseTrigger>
          </Toast.Root>
        )}
      </Toaster>
      <Box minH="100vh" bgGradient={bgGradient}>

        <Container maxW="container.xl" py={8}>
          <VStack gap={8}>
            {/* Header */}
            <HStack justify="space-between" w="full">
              <HStack gap={3}>
                <FaMicrophone size={32} color="#2196f3" />
                <Heading size="lg">מוקד פריקת עצבים</Heading>
              </HStack>

              <IconButton
                aria-label="Toggle color mode"
                onClick={toggleColorMode}
                variant="ghost"
              >
                {colorMode === "light" ? <FaMoon /> : <FaSun />}
              </IconButton>
            </HStack>

            <Separator />

            {/* Routes */}
            <Routes>
              <Route
                path="/"
                element={
                  <VStack gap={8}>
                    <VStack gap={2} textAlign="center">
                      <Heading size="xl">נו מה קרה</Heading>
                      <Text color="gray.600" fontSize="lg">
                        תקליטו לי מה הכעיס אתכם.. או שאעזור או שאעמיק לכם את הכעס.. אני אחליט
                      </Text>
                    </VStack>

                    <RecordingForm />


                  </VStack>
                }
              />

              <Route path="/avitz" element={<AdminDashboard />} />
            </Routes>
          </VStack>
        </Container>
      </Box>
    </Router>
  );
}

export default App;
