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

  // Show tasks for the selected category, or all tasks when none is selected
  const displayedTasks = selectedCategory
    ? tasks.filter((t) => t.category_id === selectedCategory.id)
    : tasks

  return (
    <Box flex={1}>
      <FlatList
        data={displayedTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskListItem task={item} overrideToggle={overrideToggle} />
        )}
        ListEmptyComponent={<TaskListEmpty />}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </Box>
  )
}

export default TaskList
