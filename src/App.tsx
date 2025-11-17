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
} from "@chakra-ui/react";
import { FaMoon, FaSun, FaMicrophone } from "react-icons/fa";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { RecordingForm } from "./components/RecordingForm";
import { AdminDashboard } from "./components/AdminDashboard";
import { useColorMode, useColorModeValue } from "./components/ui/color-mode";

function App() {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgGradient = useColorModeValue(
    "linear(to-b, blue.50, white)",
    "linear(to-b, gray.900, gray.800)"
  );

  return (
    <Router>
      <Box minH="100vh" bgGradient={bgGradient}>
        <Container maxW="container.xl" py={8}>
          <VStack gap={8}>
            {/* Header */}
            <HStack justify="space-between" w="full">
              <HStack gap={3}>
                <FaMicrophone size={32} color="#2196f3" />
                <Heading size="lg">Voice Recorder</Heading>
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
                      <Heading size="xl">Share Your Voice</Heading>
                      <Text color="gray.600" fontSize="lg">
                        Record and submit your message in seconds
                      </Text>
                    </VStack>

                    <RecordingForm />

                    <Link to="/admin">
                      <Text
                        fontSize="sm"
                        color="gray.500"
                        _hover={{ color: "brand.500" }}
                        textDecoration="underline"
                      >
                        Admin Login →
                      </Text>
                    </Link>
                  </VStack>
                }
              />

              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </VStack>
        </Container>
      </Box>
    </Router>
  );
}

export default App;
