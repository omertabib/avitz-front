import React, { useState } from "react";
import {
  Box,
  VStack,
  Input,
  Button,
  Card,
  HStack,
  Badge,
  Field,
  createToaster,
} from "@chakra-ui/react";
import { FaMicrophone, FaStop, FaUpload } from "react-icons/fa";
import { ReactMediaRecorder } from "react-media-recorder";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const toast = createToaster({
  placement: "top",
  pauseOnPageIdle: true,
});

export const RecordingForm: React.FC = () => {
  const [name, setName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const isNameValid = name.trim().length >= 2 && name.trim().length <= 50;

  const handleUpload = async (blob: Blob) => {
    if (!isNameValid) {
      toast.error({
        title: "Invalid name",
        description: "Name must be 2-50 characters",
      });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("audio", blob, "recording.webm");

    try {
      await axios.post(`${API_URL}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success({
        title: "Success!",
        description: "Your recording has been uploaded",
      });

      // Reset form
      setName("");
      setAudioBlob(null);
    } catch (error: any) {
      toast.error({
        title: "Upload failed",
        description: error.response?.data?.detail || "Something went wrong",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card.Root maxW="md" mx="auto" shadow="xl">
      <Card.Body>
        <VStack gap={6}>
          <Field.Root invalid={name.length > 0 && !isNameValid}>
            <Field.Label fontWeight="semibold">Your Name</Field.Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              size="lg"
            />
            <Field.ErrorText>
              Name must be between 2-50 characters
            </Field.ErrorText>
          </Field.Root>

          <ReactMediaRecorder
            audio
            onStop={(_, blob) => {
              setAudioBlob(blob);
            }}
            render={({
              status,
              startRecording,
              stopRecording,
              mediaBlobUrl,
            }) => (
              <VStack gap={4} w="full">
                <Box textAlign="center">
                  <Badge
                    colorPalette={status === "recording" ? "red" : "gray"}
                    size="lg"
                    variant="subtle"
                  >
                    {status === "recording"
                      ? "Recording..."
                      : status === "stopped"
                      ? "Ready to upload"
                      : "Ready to record"}
                  </Badge>
                </Box>

                <HStack gap={4}>
                  <Button
                    colorPalette="red"
                    size="lg"
                    onClick={startRecording}
                    disabled={status === "recording" || isUploading}
                    rounded="full"
                    px={8}
                  >
                    <FaMicrophone />
                    Record
                  </Button>

                  <Button
                    colorPalette="gray"
                    size="lg"
                    onClick={stopRecording}
                    disabled={status !== "recording"}
                    rounded="full"
                    px={8}
                  >
                    <FaStop />
                    Stop
                  </Button>
                </HStack>

                {mediaBlobUrl && (
                  <VStack gap={4} w="full">
                    <Box
                      bg="gray.50"
                      p={4}
                      borderRadius="lg"
                      w="full"
                      borderWidth={1}
                      borderColor="gray.200"
                      _dark={{
                        bg: "gray.800",
                        borderColor: "gray.700",
                      }}
                    >
                      <audio
                        src={mediaBlobUrl}
                        controls
                        style={{ width: "100%" }}
                      />
                    </Box>

                    <Button
                      colorPalette="brand"
                      size="lg"
                      onClick={() => audioBlob && handleUpload(audioBlob)}
                      loading={isUploading}
                      loadingText="Uploading..."
                      disabled={!isNameValid || !audioBlob}
                      w="full"
                    >
                      <FaUpload />
                      Submit Recording
                    </Button>
                  </VStack>
                )}

                {status === "recording" && <Box w="full">Loading</Box>}
              </VStack>
            )}
          />
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};
