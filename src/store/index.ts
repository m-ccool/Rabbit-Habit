import AsyncStorage from "@react-native-async-storage/async-storage"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { nanoid } from "nanoid/non-secure"

const SEED_BADGES: IBadge[] = [
  { id: "endure", name: "endure", description: "complete 5 tasks a day, 2 months", icon: "⚡", unlocked: false },
  { id: "valor", name: "valor", description: "plan tasks ahead on 100 days", icon: "🐇", unlocked: false },
  { id: "heart", name: "heart", description: "schedule 100 tasks", icon: "💚", unlocked: false },
  { id: "stoic", name: "stoic", description: "complete 100 tasks and 250 sub tasks", icon: "⭐", unlocked: false },
]

interface IGlobalStore {
  // ── data ──────────────────────────────────────────────────────────────────
  categories: ICategory[]
  tasks: ITask[]
  selectedCategory: null | ICategory
  user: IUser | null
  carrots: number
  badges: IBadge[]
  themeMode: "dark" | "light"
  lastGeneratedDate: string

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
  toggleSubTaskStatus: (taskId: string, subTaskId: string) => void
  deleteTask: (taskId: string) => void

  addCategory: (category: ICategory) => void
  deleteCategory: (categoryId: string) => void
  updateSelectedCategory: (category: ICategory) => void

  login: (username: string) => void
  logout: () => void
  addCarrots: (count: number) => void
  toggleTheme: () => void
  generateRecurringTasks: () => void
  checkBadges: () => void
}

const useGlobalStore = create<IGlobalStore>()(
  persist(
    (set, get) => ({
      // ── initial state ──────────────────────────────────────────────────────
      categories: [],
      tasks: [],
      selectedCategory: null,
      user: null,
      carrots: 0,
      badges: SEED_BADGES,
      themeMode: "dark",
      lastGeneratedDate: "",
      _hasHydrated: false,
      isCreatingTask: false,
      isDeletingTask: false,

      // ── loading setters ───────────────────────────────────────────────────
      setHasHydrated: (val) => set({ _hasHydrated: val }),
      setIsCreatingTask: (val) => set({ isCreatingTask: val }),
      setIsDeletingTask: (val) => set({ isDeletingTask: val }),

      // ── auth actions ──────────────────────────────────────────────────────
      login: (username) => set({ user: { username, isLoggedIn: true } }),
      logout: () => set({ user: null }),

      // ── carrot & theme actions ─────────────────────────────────────────────
      addCarrots: (count) => {
        const next = get().carrots + count
        set({ carrots: next })
        get().checkBadges()
      },

      toggleTheme: () =>
        set({ themeMode: get().themeMode === "dark" ? "light" : "dark" }),

      // ── badge checker ─────────────────────────────────────────────────────
      checkBadges: () => {
        const { tasks, badges, carrots } = get()
        const completedCount = tasks.filter((t) => t.completed).length
        const subTaskCompletedCount = tasks.reduce(
          (acc, t) => acc + (t.subTasks?.filter((s) => s.completed).length ?? 0), 0
        )
        const scheduledCount = tasks.filter((t) => t.repeatDays && t.repeatDays.length > 0).length
        const updatedBadges = badges.map((b) => {
          if (b.unlocked) return b
          switch (b.id) {
            case "endure": return { ...b, unlocked: completedCount >= 300 }
            case "heart":  return { ...b, unlocked: scheduledCount >= 100 }
            case "stoic":  return { ...b, unlocked: completedCount >= 100 && subTaskCompletedCount >= 250 }
            default: return b
          }
        })
        set({ badges: updatedBadges })
      },

      // ── task actions ──────────────────────────────────────────────────────
      addTask: (task) => set({ tasks: [...get().tasks, task] }),

      updateTasks: (updatedTasks) => set({ tasks: updatedTasks }),

      toggleTaskStatus: (task) => {
        const wasCompleted = task.completed
        const updatedTasks = get().tasks.map((t) =>
          t.id === task.id ? { ...task, completed: !task.completed } : t
        )
        set({ tasks: updatedTasks })
        if (!wasCompleted) {
          get().addCarrots(5)
        }
      },

      toggleSubTaskStatus: (taskId, subTaskId) => {
        const tasks = get().tasks
        let earned = false
        const updatedTasks = tasks.map((t) => {
          if (t.id !== taskId) return t
          const updatedSubTasks = (t.subTasks ?? []).map((s) => {
            if (s.id !== subTaskId) return s
            if (!s.completed) earned = true
            return { ...s, completed: !s.completed }
          })
          return { ...t, subTasks: updatedSubTasks }
        })
        set({ tasks: updatedTasks })
        if (earned) get().addCarrots(1)
      },

      deleteTask: (taskId) =>
        set({ tasks: get().tasks.filter((t) => t.id !== taskId) }),

      // ── category actions ──────────────────────────────────────────────────
      addCategory: (category) =>
        set({ categories: [...get().categories, category] }),

      deleteCategory: (categoryId) => {
        const { categories, tasks, selectedCategory } = get()
        const updatedCategories = categories.filter((c) => c.id !== categoryId)
        const updatedTasks = tasks.filter((t) => t.category_id !== categoryId)
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

      // ── recurring task generation ─────────────────────────────────────────
      generateRecurringTasks: () => {
        const today = new Date()
        const todayStr = today.toISOString().split("T")[0]
        const { lastGeneratedDate, tasks } = get()
        if (lastGeneratedDate === todayStr) return

        const todayDay = today.getDay()
        const templateTasks = tasks.filter(
          (t) => t.repeatDays?.includes(todayDay) && !t.originalId
        )
        const newInstances: ITask[] = []
        for (const template of templateTasks) {
          const instanceId = `${template.id}_${todayStr}`
          const alreadyExists = tasks.some((t) => t.id === instanceId)
          if (!alreadyExists) {
            newInstances.push({
              ...template,
              id: instanceId,
              originalId: template.id,
              generatedDate: todayStr,
              completed: false,
              repeatDays: undefined,
            })
          }
        }
        set({ tasks: [...tasks, ...newInstances], lastGeneratedDate: todayStr })
      },
    }),
    {
      name: "todos-store",
      storage: createJSONStorage(() => AsyncStorage),
      version: 2,
      migrate: (persistedState: any, version) => {
        if (version < 2) {
          return {
            ...persistedState,
            user: null,
            carrots: 0,
            badges: SEED_BADGES,
            themeMode: "dark",
            lastGeneratedDate: "",
          }
        }
        return persistedState as IGlobalStore
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)

export default useGlobalStore
