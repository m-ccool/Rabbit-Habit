import React from "react"
import { StyleSheet, View } from "react-native"
import { ShimmerBox } from "./ShimmerBox"
import TaskSkeleton from "./TaskSkeleton"

const SKELETON_COUNT = 6

/**
 * Full-screen skeleton shown while Zustand rehydrates persisted data.
 * Mirrors the Home screen layout: header bar + task cards.
 */
const HomeScreenSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Header bar skeleton */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <ShimmerBox style={styles.headerIcon} />
          <ShimmerBox style={styles.headerTitle} />
        </View>
        <ShimmerBox style={styles.headerAction} />
      </View>

      {/* Task card skeletons */}
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <TaskSkeleton key={i} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
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
  headerIcon: {
    width: 24,
    height: 24,
    borderRadius: 4,
  },
  headerTitle: {
    width: 140,
    height: 24,
    marginLeft: 16,
    borderRadius: 8,
  },
  headerAction: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
})

export default HomeScreenSkeleton
