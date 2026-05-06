import React from "react"
import { StyleSheet, View } from "react-native"
import { ShimmerBox } from "./ShimmerBox"

/**
 * Skeleton placeholder that mirrors the real Task card layout.
 * Card: white bg, 16px border-radius, my=8 mx=8, padding=16
 * Row: icon (24x24) + text line
 */
const TaskSkeleton = () => {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <ShimmerBox style={styles.icon} />
        <ShimmerBox style={styles.text} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1e1e21",
    borderRadius: 16,
    marginVertical: 8,
    marginHorizontal: 8,
    padding: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
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

export default TaskSkeleton
