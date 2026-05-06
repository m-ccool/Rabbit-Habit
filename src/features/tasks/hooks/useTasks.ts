import useGlobalStore from "@/store"

/**
 * Selector hook for task data and CRUD actions.
 * Pass a categoryId to get only tasks in that category.
 */
const useTasks = (categoryId?: string) => {
  const {
    tasks,
    addTask,
    updateTasks,
    toggleTaskStatus,
    deleteTask,
    isCreatingTask,
    isDeletingTask,
    setIsCreatingTask,
    setIsDeletingTask,
  } = useGlobalStore()

  const filteredTasks = categoryId
    ? tasks.filter((t) => t.category_id === categoryId)
    : tasks

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    addTask,
    updateTasks,
    toggleTaskStatus,
    deleteTask,
    isCreatingTask,
    isDeletingTask,
    setIsCreatingTask,
    setIsDeletingTask,
  }
}

export default useTasks
