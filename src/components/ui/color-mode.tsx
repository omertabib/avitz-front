import { useTheme } from "@chakra-ui/react";

export const useColorMode = () => {
  // In v3, color mode is handled differently
  // For now, we'll default to light mode
  return {
    colorMode: "light",
    toggleColorMode: () =>
      console.log("Color mode toggle not implemented in v3"),
  };
};

export const useColorModeValue = <T, U>(lightValue: T, darkValue: U): T | U => {
  // Always return light value for now
  return lightValue;
};
