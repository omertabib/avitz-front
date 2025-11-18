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
import {toasterComp} from "./ui/toasterComp.ts";

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
      toasterComp.error({
        title: "שם לא תקין",
        description: "אין מצב שככה קוראים לך",
      });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("audio", blob, "recording.webm");
    try {
      const res = await axios.post(`${API_URL}/api/upload?name=${formData.get("name")}`, {
        audio: formData.get("audio")
      }, {
        headers: { "Content-Type": "multipart/form-data" },
      });


      if(res.status == 200) {
       toasterComp.success({
          title: "ישתבח!",
          description: "ההקלטה נשלחה בהצלחה",
        });
        // Reset form
        setName("");
        setAudioBlob(null);
      }

    } catch (error: any) {
      toasterComp.error({
        title: "איזה עצבים",
        description: error.response?.data?.detail || "עוד משהו התשבש",
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
            <Field.Label fontWeight="semibold">נו.. איך קוראים לך</Field.Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="להקליד כאן יאללה"
              size="lg"
            />
            <Field.ErrorText>
              בלי סתלבט.. אין מצב שהשם שלך ארוך יותר מ-50 או קצר יותר מ-2 תווים
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
                      ? "יאללה לפרוק..."
                      : status === "stopped"
                      ? "מוכן לשליחה"
                      : "יאללה אפשר להקליט"}
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
                    הקלטה
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
                    עצירה
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
                      loadingText="שולח..."
                      disabled={!isNameValid || !audioBlob}
                      w="full"
                    >
                      <FaUpload />
                      יאללה לשלוח
                    </Button>
                  </VStack>
                )}

                {status === "recording" && <Box w="full">מקליט..</Box>}
              </VStack>
            )}
          />
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};
