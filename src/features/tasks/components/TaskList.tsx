import { Box } from "@/shared/utils/theme"
import React from "react"
import { FlatList } from "react-native"
import TaskListItem from "./TaskListItem"
import TaskListEmpty from "./TaskListEmpty"
import TaskListSkeleton from "./TaskListSkeleton"
import useHydration from "@/shared/hooks/useHydration"
import useGlobalStore from "@/store"

type TaskListProps = {
  overrideToggle?: (task: ITask) => void
}

const TaskList = ({ overrideToggle }: TaskListProps) => {
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
        renderItem={({ item }) => (
          <TaskListItem task={item} overrideToggle={overrideToggle} />
        )}
        ListEmptyComponent={<TaskListEmpty />}
      />
    </Box>
  )
}

export default TaskList
