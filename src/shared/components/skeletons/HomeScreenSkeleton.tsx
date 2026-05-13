import React from "react"
import { StyleSheet, View } from "react-native"
import { ShimmerBox } from "./ShimmerBox"
import TaskSkeleton from "./TaskSkeleton"

const SKELETON_COUNT = 6

const HomeScreenSkeleton = () => {
  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <ShimmerBox style={{ width: 24, height: 24, borderRadius: 4 }} />
          <ShimmerBox style={{ width: 140, height: 24, marginLeft: 16, borderRadius: 8 }} />
        </View>
        <ShimmerBox style={{ width: 32, height: 32, borderRadius: 8 }} />
      </View>
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <TaskSkeleton key={i} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
})

export default HomeScreenSkeleton
