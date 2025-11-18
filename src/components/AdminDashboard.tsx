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
import {toasterComp} from "./ui/toasterComp.ts";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";


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
      const response = await axios.get(`${API_URL}/resource/recordings`, {
        headers: { Authorization: `Bearer ${password}` },
      });
      setRecordings(response.data.recordings);
      setIsAuthenticated(true);
      toasterComp.success({
        title: "אהלן",
        description: "ברוך הבא"
      });
    } catch (error) {
      toasterComp.error({
        title: "הזדהות נכשלה",
        description: "סיסמה שגויה",
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
            התחברות לממשק ניהול
          </Heading>
        </Card.Header>
        <Card.Body>
          <VStack gap={4}>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="הכנס סיסמת מנהל"
              size="lg"
              onKeyPress={(e) => e.key === "שלח" && fetchRecordings()}
            />

            <Button
              colorPalette="brand"
              size="lg"
              onClick={fetchRecordings}
              loading={loading}
              loadingText="רגע..."
              w="full"
            >
              התחברות
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
              <Stat.Label>הקלטות</Stat.Label>
              <Stat.ValueText fontSize="2xl">
                {recordings.length}
              </Stat.ValueText>
            </Stat.Root>
          </Card.Body>
        </Card.Root>

        <Card.Root bg={statBg}>
          <Card.Body>
            <Stat.Root>
              <Stat.Label>סך הכל אורך</Stat.Label>
              <Stat.ValueText fontSize="2xl">
                {formatDuration(totalDuration)}
              </Stat.ValueText>
            </Stat.Root>
          </Card.Body>
        </Card.Root>

        <Card.Root bg={statBg}>
          <Card.Body>
            <Stat.Root>
              <Stat.Label>סך אחסון</Stat.Label>
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
            <Heading size="md">כל ההקלטות</Heading>
            <Button
              size="sm"
              onClick={fetchRecordings}
              loading={loading}
              variant="outline"
            >
              <FaClock />
              רענן
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
                  <Table.ColumnHeader>שם</Table.ColumnHeader>
                  <Table.ColumnHeader>תאריך & שעה</Table.ColumnHeader>
                  <Table.ColumnHeader>אורך</Table.ColumnHeader>
                  <Table.ColumnHeader>גודל</Table.ColumnHeader>
                  <Table.ColumnHeader>הפעלה</Table.ColumnHeader>
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
              <Text color="gray.500">אין הקלטות</Text>
            </Box>
          )}
        </Card.Body>
      </Card.Root>
    </VStack>
  );
};
