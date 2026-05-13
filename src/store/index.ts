import AsyncStorage from "@react-native-async-storage/async-storage"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { nanoid } from "nanoid/non-secure"

type AuthUser = {
  email: string
  password: string
}

export type ShellModule = "tasks" | "categories" | "rewards" | "profile"

const DEV_AUTH_USER: AuthUser = {
  email: "test@test.com",
  password: "test",
}

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
  authUsers: AuthUser[]
  carrots: number
  badges: IBadge[]
  themeMode: "dark" | "light"
  lastGeneratedDate: string
  activeShellModule: ShellModule

  // ── loading flags ─────────────────────────────────────────────────────────
  _hasHydrated: boolean
  isCreatingTask: boolean
  isDeletingTask: boolean

  // ── actions ───────────────────────────────────────────────────────────────
  setHasHydrated: (val: boolean) => void
  setIsCreatingTask: (val: boolean) => void
  setIsDeletingTask: (val: boolean) => void
  setActiveShellModule: (module: ShellModule) => void

  addTask: (task: ITask) => void
  updateTasks: (tasks: ITask[]) => void
  toggleTaskStatus: (task: ITask) => void
  toggleSubTaskStatus: (taskId: string, subTaskId: string) => void
  deleteTask: (taskId: string) => void

  addCategory: (category: ICategory) => void
  deleteCategory: (categoryId: string) => void
  updateSelectedCategory: (category: ICategory) => void

  login: (email: string, password: string) => boolean
  registerUser: (email: string, password: string) => boolean
  logout: () => void
  addCarrots: (count: number) => void
  toggleTheme: () => void
  generateRecurringTasks: () => void
  checkBadges: () => void

  // ── streak ────────────────────────────────────────────────────────────────
  currentStreak: number
  lastCompletionDate: string | null // ISO date "YYYY-MM-DD"
  checkAndUpdateStreak: () => void
}

const useGlobalStore = create<IGlobalStore>()(
  persist(
    (set, get) => ({
      // ── initial state ──────────────────────────────────────────────────────
      categories: [],
      tasks: [],
      selectedCategory: null,
      user: null,
      authUsers: [DEV_AUTH_USER],
      carrots: 0,
      badges: SEED_BADGES,
      themeMode: "dark",
      lastGeneratedDate: "",
      activeShellModule: "tasks",
      currentStreak: 0,
      lastCompletionDate: null,
      _hasHydrated: false,
      isCreatingTask: false,
      isDeletingTask: false,

      // ── loading setters ───────────────────────────────────────────────────
      setHasHydrated: (val) => set({ _hasHydrated: val }),
      setIsCreatingTask: (val) => set({ isCreatingTask: val }),
      setIsDeletingTask: (val) => set({ isDeletingTask: val }),
      setActiveShellModule: (module) => set({ activeShellModule: module }),

      // ── auth actions ──────────────────────────────────────────────────────
      login: (email, password) => {
        const normalizedEmail = email.trim().toLowerCase()
        const matchedUser = get().authUsers.find(
          (user) => user.email === normalizedEmail && user.password === password
        )

        if (!matchedUser) return false

        set({ user: { username: matchedUser.email, isLoggedIn: true } })
        return true
      },

      registerUser: (email, password) => {
        const normalizedEmail = email.trim().toLowerCase()
        if (!normalizedEmail || !password.trim()) return false

        const { authUsers } = get()
        const alreadyExists = authUsers.some((user) => user.email === normalizedEmail)
        if (alreadyExists) return false

        set({ authUsers: [...authUsers, { email: normalizedEmail, password }] })
        return true
      },

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

      // ── streak actions ────────────────────────────────────────────────────
      checkAndUpdateStreak: () => {
        const { lastCompletionDate, currentStreak } = get()
        const today = new Date().toISOString().slice(0, 10)
        if (lastCompletionDate === today) return // already updated today

        const yesterday = new Date(Date.now() - 86400000)
          .toISOString()
          .slice(0, 10)
        const newStreak =
          lastCompletionDate === yesterday ? currentStreak + 1 : 1
        set({ currentStreak: newStreak, lastCompletionDate: today })
      },
    }),
    {
      name: "todos-store",
      storage: createJSONStorage(() => AsyncStorage),
      version: 4,
      migrate: (persistedState: any, version) => {
        if (version < 2) {
          persistedState.user = null
          persistedState.carrots = 0
          persistedState.badges = SEED_BADGES
          persistedState.themeMode = "dark"
          persistedState.lastGeneratedDate = ""
        }
        if (version < 3) {
          persistedState.currentStreak = 0
          persistedState.lastCompletionDate = null
        }
        if (version < 4) {
          persistedState.authUsers = [DEV_AUTH_USER]
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
