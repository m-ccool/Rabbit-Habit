import { Box } from "@/shared/utils/theme"
import { BottomSheetModal } from "@gorhom/bottom-sheet"
import { useNavigation } from "@react-navigation/native"
import React, { RefObject } from "react"
import { FlatList, Pressable } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import CategoryItem from "./CategoryItem"
import CategoryListSkeleton from "./CategoryListSkeleton"
import useGlobalStore from "@/store"
import useHydration from "@/shared/hooks/useHydration"

type CategoryFilterSheetProps = {
  bottomSheetRef: RefObject<BottomSheetModal>
}

/**
 * Contents of the bottom sheet that lets the user pick a category to filter by.
 * Extracted from the Home screen so Home stays lean.
 */
const CategoryFilterSheet = ({ bottomSheetRef }: CategoryFilterSheetProps) => {
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  const { categories } = useGlobalStore()
  const hasHydrated = useHydration()

  return (
    <Box flex={1} mx="4">
      {hasHydrated ? (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <CategoryItem
              key={item.id}
              index={index}
              category={item}
              bottomSheetRef={bottomSheetRef}
            />
          )}
        />
      ) : (
        <CategoryListSkeleton />
      )}

      {/* Add category FAB */}
      <Box position="absolute" right={20} bottom={insets.bottom}>
        <Pressable
          onPress={() => {
            bottomSheetRef.current?.close()
            navigation.navigate("CreateCategory")
          }}
          accessibilityRole="button"
          accessibilityLabel="Add category"
        >
          <Box
            bg="dark600"
            width={64}
            height={64}
            borderRadius="roundedFull"
            alignItems="center"
            justifyContent="center"
          >
            <MaterialCommunityIcons name="plus" size={40} color="#ffffff" />
          </Box>
        </Pressable>
      </Box>
    </Box>
  )
}

export default CategoryFilterSheet
