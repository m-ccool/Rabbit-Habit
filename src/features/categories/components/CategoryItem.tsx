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

const CategoryItem = ({ bottomSheetRef, category }: CategoryItemProps) => {
  const { updateSelectedCategory, selectedCategory } = useGlobalStore()

  const onSelect = () => {
    updateSelectedCategory(category)
    bottomSheetRef.current?.close()
  }

  const isSelected = selectedCategory?.id === category.id

  return (
    <Pressable
      onPress={onSelect}
      accessibilityRole="button"
      accessibilityLabel={`Select category ${category.name}`}
      style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
    >
      <Box
        p="4"
        borderRadius="rounded2Xl"
        flexDirection="row"
        alignItems="center"
        mb="2"
        bg={isSelected ? "dark600" : "dark800"}
        borderWidth={1}
        borderColor="separator"
      >
        <FontAwesome name="square-o" size={24} color={category.color.code} />
        <Text variant="textXl" ml="4">{category.name}</Text>
      </Box>
    </Pressable>
  )
}

export default CategoryItem
