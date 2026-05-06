import { Box } from "@/shared/utils/theme"
import React from "react"
import { FlatList } from "react-native"
import TaskListItem from "./TaskListItem"
import TaskListEmpty from "./TaskListEmpty"
import TaskListSkeleton from "./TaskListSkeleton"
import useHydration from "@/shared/hooks/useHydration"
import useGlobalStore from "@/store"

/**
 * Pure FlatList rendering tasks for the currently selected category.
 * Shows a skeleton while persisted state is rehydrating.
 */
const TaskList = () => {
  const hasHydrated = useHydration()
  const { tasks, selectedCategory } = useGlobalStore()

  if (!hasHydrated) {
    return <TaskListSkeleton />
  }

  if (!selectedCategory) {
    return null
  }

  const tasksInCategory = tasks.filter(
    (t) => t.category_id === selectedCategory.id
  )

  return (
    <Box flex={1}>
      <FlatList
        data={tasksInCategory}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TaskListItem task={item} />}
        ListEmptyComponent={<TaskListEmpty />}
      />
    </Box>
  )
}

export default TaskList
