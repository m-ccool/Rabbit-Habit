import React from "react"
import { StyleSheet, View } from "react-native"
import { ShimmerBox } from "./ShimmerBox"

/**
 * Skeleton placeholder that mirrors the real Category row layout.
 * Row: p=16, borderRadius=8, icon (24x24) + text label
 */
const CategorySkeleton = () => {
  return (
    <View style={styles.row}>
      <ShimmerBox style={styles.icon} />
      <ShimmerBox style={styles.text} />
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  icon: {
    width: 24,
    height: 24,
    borderRadius: 4,
  },
  text: {
    flex: 1,
    height: 20,
    marginLeft: 16,
    borderRadius: 8,
  },
})

export default CategorySkeleton
