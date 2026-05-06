import useGlobalStore from "@/store"
import { Box, Text } from "@/shared/utils/theme"
import { FontAwesome } from "@expo/vector-icons"
import { BottomSheetModal } from "@gorhom/bottom-sheet"
import React, { RefObject } from "react"
import { Pressable } from "react-native"

type CategoryItemProps = {
  category: ICategory
  index: number
  bottomSheetRef: RefObject<BottomSheetModal>
}

/**
 * A single tappable category row inside the filter bottom sheet.
 */
const CategoryItem = ({ bottomSheetRef, category }: CategoryItemProps) => {
  const { updateSelectedCategory, selectedCategory } = useGlobalStore()

  const onSelect = () => {
    updateSelectedCategory(category)
    bottomSheetRef.current?.close()
  }

  return (
    <Pressable
      onPress={onSelect}
      accessibilityRole="button"
      accessibilityLabel={`Select category ${category.name}`}
    >
      <Box
        p="4"
        bg={selectedCategory?.id === category.id ? "dark600" : "dark800"}
        borderRadius="roundedXl"
        flexDirection="row"
        alignItems="center"
        mb="2"
      >
        <FontAwesome name="square-o" size={24} color={category.color.code} />
        <Text variant="textXl" ml="4">
          {category.name}
        </Text>
      </Box>
    </Pressable>
  )
}

export default CategoryItem
