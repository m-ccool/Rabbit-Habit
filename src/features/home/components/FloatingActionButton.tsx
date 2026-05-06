import { Box } from "@/shared/utils/theme"
import { useNavigation } from "@react-navigation/native"
import React from "react"
import { Platform, Pressable } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { MaterialCommunityIcons } from "@expo/vector-icons"

/**
 * Floating action button that navigates to the Create Task screen.
 */
const FloatingActionButton = () => {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()
  const isAndroid = Platform.OS === "android"

  return (
    <Box
      position="absolute"
      bottom={insets.bottom + (isAndroid ? 100 : 40)}
      right={20}
    >
      <Pressable
        onPress={() => navigation.navigate("CreateTask")}
        accessibilityRole="button"
        accessibilityLabel="Create new task"
      >
        <Box
          bg="gray200"
          width={64}
          height={64}
          alignItems="center"
          justifyContent="center"
          borderRadius="roundedXl"
        >
          <MaterialCommunityIcons name="plus" size={40} color="black" />
        </Box>
      </Pressable>
    </Box>
  )
}

export default FloatingActionButton
