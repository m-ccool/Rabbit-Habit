import { Box, Text } from "@/shared/utils/theme"
import useGlobalStore from "@/store"
import { FontAwesome, Ionicons } from "@expo/vector-icons"
import { BottomSheetModal } from "@gorhom/bottom-sheet"
import React, { RefObject } from "react"
import { Pressable } from "react-native"

type HomeHeaderProps = {
  bottomSheetRef: RefObject<BottomSheetModal>
}

/**
 * Top bar of the Home screen: active category name + filter button.
 */
const HomeHeader = ({ bottomSheetRef }: HomeHeaderProps) => {
  const { selectedCategory } = useGlobalStore()

  return (
    <Box
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      mt="4"
      px="4"
    >
      <Box flexDirection="row" alignItems="center">
        <FontAwesome
          name="square-o"
          size={24}
          color={selectedCategory?.color.code ?? "#9ca3af"}
        />
        <Text variant="text2Xl" ml="4">
          {selectedCategory?.name ?? "Select a category"}
        </Text>
      </Box>

      <Pressable
        onPress={() => bottomSheetRef.current?.present()}
        accessibilityRole="button"
        accessibilityLabel="Filter by category"
      >
        <Ionicons size={32} name="ios-filter" color="#ffffff" />
      </Pressable>
    </Box>
  )
}

export default HomeHeader
