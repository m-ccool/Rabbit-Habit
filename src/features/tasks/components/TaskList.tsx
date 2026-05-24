import { Box } from "@/shared/utils/theme"
import React, { useRef } from "react"
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

  // Track which task IDs were present on initial load so newly added tasks
  // can use a spring-pop entrance instead of the stagger sequence.
  const initialIdsRef = useRef<Set<string> | null>(null)

  if (!hasHydrated) {
    return <TaskListSkeleton />
  }

  // Show tasks for the selected category, or all tasks when none is selected
  const displayedTasks = selectedCategory
    ? tasks.filter((t) => t.category_id === selectedCategory.id)
    : tasks

  // Capture initial IDs once after hydration
  if (initialIdsRef.current === null) {
    initialIdsRef.current = new Set(displayedTasks.map((t) => t.id))
  }

  return (
    <Box flex={1}>
      <FlatList
        data={displayedTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <TaskListItem
            task={item}
            index={index}
            isNew={!initialIdsRef.current!.has(item.id)}
            overrideToggle={overrideToggle}
          />
        )}
        ListEmptyComponent={<TaskListEmpty />}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </Box>
  )
}

export default TaskList
