import React from "react"
import { StyleSheet, View } from "react-native"
import { ShimmerBox } from "./ShimmerBox"

const CategorySkeleton = () => {
  return (
    <View style={styles.row}>
      <ShimmerBox style={{ width: 24, height: 24, borderRadius: 4 }} />
      <ShimmerBox style={{ flex: 1, height: 20, marginLeft: 16, borderRadius: 8 }} />
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
})

export default CategorySkeleton
