import React from "react"
import { View } from "react-native"
import CategorySkeleton from "@/shared/components/skeletons/CategorySkeleton"

const SKELETON_COUNT = 4

const CategoryListSkeleton = () => {
  return (
    <View style={{ flex: 1 }}>
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <CategorySkeleton key={i} />
      ))}
    </View>
  )
}

export default CategoryListSkeleton
