import React from "react"
import { StyleSheet, View } from "react-native"
import { ShimmerBox } from "./ShimmerBox"

const TaskSkeleton = () => {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <ShimmerBox style={{ width: 24, height: 24, borderRadius: 4 }} />
        <ShimmerBox style={{ flex: 1, height: 20, marginLeft: 16, borderRadius: 8 }} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    marginVertical: 8,
    marginHorizontal: 8,
    padding: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
})

export default TaskSkeleton
