import React from "react"
import { View, StyleSheet } from "react-native"
import TaskSkeleton from "@/shared/components/skeletons/TaskSkeleton"

const SKELETON_COUNT = 5

/**
 * Shows shimmer task cards while tasks are loading.
 */
const TaskListSkeleton = () => {
  return (
    <View style={styles.container}>
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <TaskSkeleton key={i} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default TaskListSkeleton
