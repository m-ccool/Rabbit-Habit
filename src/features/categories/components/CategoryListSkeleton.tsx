import React from "react"
import { StyleSheet, View } from "react-native"
import CategorySkeleton from "@/shared/components/skeletons/CategorySkeleton"

const SKELETON_COUNT = 4

const CategoryListSkeleton = () => {
  return (
    <View style={styles.container}>
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <CategorySkeleton key={i} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
})

export default CategoryListSkeleton
