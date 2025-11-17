import React, { useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Button,
  Card,
  Heading,
  Text,
  Spinner,
  Badge,
  SimpleGrid,
  Table,
  createToaster,
  Stat,
} from "@chakra-ui/react";
import { PasswordInput } from "./ui/password-input";
import { FaUser, FaClock } from "react-icons/fa";
import axios from "axios";
import { Recording } from "../types";
import { useColorModeValue } from "./ui/color-mode";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const toast = createToaster({
  placement: "top",
});

export const AdminDashboard: React.FC = () => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  const cardBg = useColorModeValue("white", "gray.800");
  const statBg = useColorModeValue("gray.50", "gray.700");

  const fetchRecordings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/admin/recordings`, {
        headers: { Authorization: `Bearer ${password}` },
      });
      setRecordings(response.data.recordings);
      setIsAuthenticated(true);
      toast.success({
        title: "Welcome, Admin",
      });
    } catch (error) {
      toast.error({
        title: "Authentication failed",
        description: "Invalid password",
      });
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  if (!isAuthenticated) {
    return (
      <Card.Root maxW="md" mx="auto" shadow="xl">
        <Card.Header>
          <Heading size="lg" textAlign="center">
            Admin Login
          </Heading>
        </Card.Header>
        <Card.Body>
          <VStack gap={4}>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              size="lg"
              onKeyPress={(e) => e.key === "Enter" && fetchRecordings()}
            />

            <Button
              colorPalette="brand"
              size="lg"
              onClick={fetchRecordings}
              loading={loading}
              loadingText="Authenticating..."
              w="full"
            >
              Login
            </Button>
          </VStack>
        </Card.Body>
      </Card.Root>
    );
  }

  const totalDuration = recordings.reduce((acc, rec) => acc + rec.duration, 0);
  const totalSize = recordings.reduce((acc, rec) => acc + rec.size, 0);

  return (
    <VStack gap={6} align="stretch">
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
        <Card.Root bg={statBg}>
          <Card.Body>
            <Stat.Root>
              <Stat.Label>Total Recordings</Stat.Label>
              <Stat.ValueText fontSize="2xl">
                {recordings.length}
              </Stat.ValueText>
            </Stat.Root>
          </Card.Body>
        </Card.Root>

        <Card.Root bg={statBg}>
          <Card.Body>
            <Stat.Root>
              <Stat.Label>Total Duration</Stat.Label>
              <Stat.ValueText fontSize="2xl">
                {formatDuration(totalDuration)}
              </Stat.ValueText>
            </Stat.Root>
          </Card.Body>
        </Card.Root>

        <Card.Root bg={statBg}>
          <Card.Body>
            <Stat.Root>
              <Stat.Label>Total Storage</Stat.Label>
              <Stat.ValueText fontSize="2xl">
                {formatFileSize(totalSize)}
              </Stat.ValueText>
            </Stat.Root>
          </Card.Body>
        </Card.Root>
      </SimpleGrid>

      <Card.Root shadow="xl" bg={cardBg}>
        <Card.Header>
          <HStack justify="space-between">
            <Heading size="md">All Recordings</Heading>
            <Button
              size="sm"
              onClick={fetchRecordings}
              loading={loading}
              variant="outline"
            >
              <FaClock />
              Refresh
            </Button>
          </HStack>
        </Card.Header>

        <Card.Body>
          {loading ? (
            <Box textAlign="center" py={10}>
              <Spinner size="xl" color="brand.500" />
            </Box>
          ) : (
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Name</Table.ColumnHeader>
                  <Table.ColumnHeader>Date & Time</Table.ColumnHeader>
                  <Table.ColumnHeader>Duration</Table.ColumnHeader>
                  <Table.ColumnHeader>Size</Table.ColumnHeader>
                  <Table.ColumnHeader>Play</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {recordings.map((recording) => (
                  <Table.Row key={recording.id}>
                    <Table.Cell>
                      <HStack gap={2}>
                        <FaUser color="gray.500" />
                        <Text fontWeight="medium">{recording.name}</Text>
                      </HStack>
                    </Table.Cell>
                    <Table.Cell>
                      <VStack align="start" gap={0}>
                        <Text fontSize="sm">
                          {new Date(recording.uploaded).toLocaleDateString()}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {new Date(recording.uploaded).toLocaleTimeString()}
                        </Text>
                      </VStack>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge colorPalette="blue" variant="subtle">
                        {formatDuration(recording.duration)}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Text fontSize="sm" color="gray.600">
                        {formatFileSize(recording.size)}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <audio
                        src={recording.url}
                        controls
                        style={{ minWidth: "200px" }}
                      />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          )}

          {recordings.length === 0 && !loading && (
            <Box textAlign="center" py={10}>
              <Text color="gray.500">No recordings yet</Text>
            </Box>
          )}
        </Card.Body>
      </Card.Root>
    </VStack>
  );
};
