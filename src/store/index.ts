import AsyncStorage from "@react-native-async-storage/async-storage"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

/**
 * Global store
 * - persisted via AsyncStorage (zustand persist middleware)
 * - version-gated with a migrate() for forward-compatible schema changes
 * - tracks rehydration state so UI can show skeletons on cold start
 */

interface IGlobalStore {
  // ── data ──────────────────────────────────────────────────────────────────
  categories: ICategory[]
  tasks: ITask[]
  selectedCategory: null | ICategory

  // ── loading flags ─────────────────────────────────────────────────────────
  _hasHydrated: boolean
  isCreatingTask: boolean
  isDeletingTask: boolean

  // ── actions ───────────────────────────────────────────────────────────────
  setHasHydrated: (val: boolean) => void
  setIsCreatingTask: (val: boolean) => void
  setIsDeletingTask: (val: boolean) => void

  addTask: (task: ITask) => void
  updateTasks: (tasks: ITask[]) => void
  toggleTaskStatus: (task: ITask) => void
  deleteTask: (taskId: string) => void

  addCategory: (category: ICategory) => void
  deleteCategory: (categoryId: string) => void
  updateSelectedCategory: (category: ICategory) => void
}

const useGlobalStore = create<IGlobalStore>()(
  persist(
    (set, get) => ({
      // ── initial state ──────────────────────────────────────────────────────
      categories: [],
      tasks: [],
      selectedCategory: null,
      _hasHydrated: false,
      isCreatingTask: false,
      isDeletingTask: false,

      // ── loading setters ───────────────────────────────────────────────────
      setHasHydrated: (val) => set({ _hasHydrated: val }),
      setIsCreatingTask: (val) => set({ isCreatingTask: val }),
      setIsDeletingTask: (val) => set({ isDeletingTask: val }),

      // ── task actions ──────────────────────────────────────────────────────
      addTask: (task) => set({ tasks: [...get().tasks, task] }),

      updateTasks: (updatedTasks) => set({ tasks: updatedTasks }),

      toggleTaskStatus: (task) => {
        const updatedTasks = get().tasks.map((t) =>
          t.id === task.id ? { ...task, completed: !task.completed } : t
        )
        set({ tasks: updatedTasks })
      },

      deleteTask: (taskId) =>
        set({ tasks: get().tasks.filter((t) => t.id !== taskId) }),

      // ── category actions ──────────────────────────────────────────────────
      addCategory: (category) =>
        set({ categories: [...get().categories, category] }),

      deleteCategory: (categoryId) => {
        const { categories, tasks, selectedCategory } = get()
        const updatedCategories = categories.filter((c) => c.id !== categoryId)
        // cascade-delete all tasks belonging to the removed category
        const updatedTasks = tasks.filter((t) => t.category_id !== categoryId)
        // clear selectedCategory if it was the deleted one
        const updatedSelected =
          selectedCategory?.id === categoryId ? null : selectedCategory
        set({
          categories: updatedCategories,
          tasks: updatedTasks,
          selectedCategory: updatedSelected,
        })
      },

      updateSelectedCategory: (category) =>
        set({ selectedCategory: category }),
    }),
    {
      name: "todos-store",
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      migrate: (persistedState, version) => {
        // Add future migrations here as version increments.
        // e.g. version 1 → 2: transform persistedState fields as needed.
        return persistedState as IGlobalStore
      },
      onRehydrateStorage: () => (state) => {
        // Called once rehydration is complete (or failed).
        state?.setHasHydrated(true)
      },
    }
  )
)

export default useGlobalStore
