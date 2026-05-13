import React from "react"
import { View } from "react-native"
import TaskSkeleton from "@/shared/components/skeletons/TaskSkeleton"

const SKELETON_COUNT = 5

const TaskListSkeleton = () => {
  return (
    <View style={{ flex: 1 }}>
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <TaskSkeleton key={i} />
      ))}
    </View>
  )
}

export default TaskListSkeleton
