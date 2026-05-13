import { useNavigation } from "@react-navigation/native"
import React from "react"
import { Platform, Pressable } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Box } from "@/shared/utils/theme"

const FloatingActionButton = () => {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()
  const isAndroid = Platform.OS === "android"

  return (
    <Box position="absolute" right={20} style={{ bottom: insets.bottom + (isAndroid ? 100 : 40) }}>
      <Pressable
        onPress={() => navigation.navigate("CreateTask")}
        accessibilityRole="button"
        accessibilityLabel="Create new task"
        style={({ pressed }) => [{ opacity: pressed ? 0.86 : 1, transform: [{ scale: pressed ? 0.96 : 1 }] }]}
      >
        <Box
          bg="systemPink"
          width={64}
          height={64}
          alignItems="center"
          justifyContent="center"
          borderRadius="roundedFull"
          style={{ shadowColor: "#FF375F", shadowOpacity: 0.35, shadowRadius: 20, shadowOffset: { width: 0, height: 10 } }}
        >
          <MaterialCommunityIcons name="plus" size={40} color="#ffffff" />
        </Box>
      </Pressable>
    </Box>
  )
}

export default FloatingActionButton
