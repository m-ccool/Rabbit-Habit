import React, { createContext, useContext, useEffect, useReducer } from 'react'

// ── Seed Data ─────────────────────────────────────────────────────────────────
const SEED_BADGES: IBadge[] = [
  { id: 'endure', name: 'endure', description: 'complete 5 tasks a day, 2 months', icon: '⚡', unlocked: false },
  { id: 'valor',  name: 'valor',  description: 'plan tasks ahead on 100 days',     icon: '🐇', unlocked: false },
  { id: 'heart',  name: 'heart',  description: 'schedule 100 tasks',               icon: '💚', unlocked: false },
  { id: 'stoic',  name: 'stoic',  description: 'complete 100 tasks and 250 sub tasks', icon: '⭐', unlocked: false },
]

// ── State Shape ───────────────────────────────────────────────────────────────
export interface AppState {
  categories: ICategory[]
  tasks: ITask[]
  selectedCategory: ICategory | null
  user: IUser | null
  carrots: number
  badges: IBadge[]
  themeMode: 'dark' | 'light'
  lastGeneratedDate: string
  _hasHydrated: boolean
  isCreatingTask: boolean
  isDeletingTask: boolean
}

const initialState: AppState = {
  categories: [],
  tasks: [],
  selectedCategory: null,
  user: null,
  carrots: 0,
  badges: SEED_BADGES,
  themeMode: 'dark',
  lastGeneratedDate: '',
  _hasHydrated: false,
  isCreatingTask: false,
  isDeletingTask: false,
}

// ── Action Types ──────────────────────────────────────────────────────────────
export type AppAction =
  | { type: 'auth/login'; payload: string }
  | { type: 'auth/logout' }
  | { type: 'tasks/add'; payload: ITask }
  | { type: 'tasks/update'; payload: ITask[] }
  | { type: 'tasks/delete'; payload: string }
  | { type: 'tasks/toggleStatus'; payload: ITask }
  | { type: 'tasks/toggleSubTask'; payload: { taskId: string; subTaskId: string } }
  | { type: 'tasks/generateRecurring' }
  | { type: 'categories/add'; payload: ICategory }
  | { type: 'categories/delete'; payload: string }
  | { type: 'categories/select'; payload: ICategory | null }
  | { type: 'settings/toggleTheme' }
  | { type: 'carrots/add'; payload: number }
  | { type: 'hydration/complete'; payload: Partial<AppState> }
  | { type: 'loading/setCreating'; payload: boolean }
  | { type: 'loading/setDeleting'; payload: boolean }

// ── Internal Helpers ──────────────────────────────────────────────────────────
function checkBadges(tasks: ITask[], badges: IBadge[]): IBadge[] {
  const completedCount        = tasks.filter(t => t.completed).length
  const subTaskCompletedCount = tasks.reduce(
    (acc, t) => acc + (t.subTasks?.filter(s => s.completed).length ?? 0), 0
  )
  const scheduledCount = tasks.filter(t => t.repeatDays && t.repeatDays.length > 0).length
  return badges.map(b => {
    if (b.unlocked) return b
    switch (b.id) {
      case 'endure': return { ...b, unlocked: completedCount >= 300 }
      case 'heart':  return { ...b, unlocked: scheduledCount >= 100 }
      case 'stoic':  return { ...b, unlocked: completedCount >= 100 && subTaskCompletedCount >= 250 }
      default:       return b
    }
  })
}

function generateRecurringTasks(state: AppState): Pick<AppState, 'tasks' | 'lastGeneratedDate'> | null {
  const today    = new Date()
  const todayStr = today.toISOString().split('T')[0]
  if (state.lastGeneratedDate === todayStr) return null

  const todayDay     = today.getDay()
  const templateTasks = state.tasks.filter(t => t.repeatDays?.includes(todayDay) && !t.originalId)
  const newInstances: ITask[] = []
  for (const template of templateTasks) {
    const instanceId    = `${template.id}_${todayStr}`
    const alreadyExists = state.tasks.some(t => t.id === instanceId)
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
  return { tasks: [...state.tasks, ...newInstances], lastGeneratedDate: todayStr }
}

// ── Reducer ───────────────────────────────────────────────────────────────────
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'auth/login':
      return { ...state, user: { username: action.payload, isLoggedIn: true } }
    case 'auth/logout':
      return { ...state, user: null }

    case 'tasks/add':
      return { ...state, tasks: [...state.tasks, action.payload] }
    case 'tasks/update':
      return { ...state, tasks: action.payload }
    case 'tasks/delete':
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) }

    case 'tasks/toggleStatus': {
      const wasCompleted  = action.payload.completed
      const updatedTasks  = state.tasks.map(t =>
        t.id === action.payload.id ? { ...action.payload, completed: !action.payload.completed } : t
      )
      const nextCarrots   = wasCompleted ? state.carrots : state.carrots + 5
      const updatedBadges = wasCompleted ? state.badges : checkBadges(updatedTasks, state.badges)
      return { ...state, tasks: updatedTasks, carrots: nextCarrots, badges: updatedBadges }
    }

    case 'tasks/toggleSubTask': {
      const { taskId, subTaskId } = action.payload
      let earned = false
      const updatedTasks = state.tasks.map(t => {
        if (t.id !== taskId) return t
        const updatedSubTasks = (t.subTasks ?? []).map(s => {
          if (s.id !== subTaskId) return s
          if (!s.completed) earned = true
          return { ...s, completed: !s.completed }
        })
        return { ...t, subTasks: updatedSubTasks }
      })
      const nextCarrots   = earned ? state.carrots + 1 : state.carrots
      const updatedBadges = earned ? checkBadges(updatedTasks, state.badges) : state.badges
      return { ...state, tasks: updatedTasks, carrots: nextCarrots, badges: updatedBadges }
    }

    case 'tasks/generateRecurring': {
      const updates = generateRecurringTasks(state)
      return updates ? { ...state, ...updates } : state
    }

    case 'categories/add':
      return { ...state, categories: [...state.categories, action.payload] }
    case 'categories/delete': {
      const id = action.payload
      return {
        ...state,
        categories:       state.categories.filter(c => c.id !== id),
        tasks:            state.tasks.filter(t => t.category_id !== id),
        selectedCategory: state.selectedCategory?.id === id ? null : state.selectedCategory,
      }
    }
    case 'categories/select':
      return { ...state, selectedCategory: action.payload }

    case 'settings/toggleTheme':
      return { ...state, themeMode: state.themeMode === 'dark' ? 'light' : 'dark' }

    case 'carrots/add': {
      const nextCarrots = state.carrots + action.payload
      return { ...state, carrots: nextCarrots, badges: checkBadges(state.tasks, state.badges) }
    }

    case 'hydration/complete':
      return { ...state, ...action.payload, _hasHydrated: true }

    case 'loading/setCreating':
      return { ...state, isCreatingTask: action.payload }
    case 'loading/setDeleting':
      return { ...state, isDeletingTask: action.payload }

    default:
      return state
  }
}

// ── Persistence ───────────────────────────────────────────────────────────────
const STORAGE_KEY = 'rabbit-habit-store'

const PERSISTED_KEYS: (keyof AppState)[] = [
  'categories', 'tasks', 'user', 'carrots', 'badges',
  'themeMode', 'lastGeneratedDate', 'selectedCategory',
]

function loadFromStorage(): Partial<AppState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as Partial<AppState>
  } catch {
    return {}
  }
}

function saveToStorage(state: AppState): void {
  const partial: Partial<AppState> = {}
  for (const key of PERSISTED_KEYS) {
    ;(partial as Record<string, unknown>)[key] = state[key]
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(partial))
}

// ── Contexts ──────────────────────────────────────────────────────────────────
const AppStateContext    = createContext<AppState>(initialState)
const AppDispatchContext = createContext<React.Dispatch<AppAction>>(() => {})

// ── Provider ──────────────────────────────────────────────────────────────────
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Hydrate from localStorage on first mount
  useEffect(() => {
    const persisted = loadFromStorage()
    dispatch({ type: 'hydration/complete', payload: persisted })
  }, [])

  // Persist state to localStorage whenever it changes (after hydration)
  useEffect(() => {
    if (state._hasHydrated) {
      saveToStorage(state)
    }
  }, [state])

  // Apply dark/light class to <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.themeMode === 'dark')
  }, [state.themeMode])

  // Generate recurring tasks once hydration completes
  useEffect(() => {
    if (state._hasHydrated) {
      dispatch({ type: 'tasks/generateRecurring' })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state._hasHydrated])

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  )
}

// ── Hooks ─────────────────────────────────────────────────────────────────────
export function useAppState(): AppState {
  return useContext(AppStateContext)
}

export function useAppDispatch(): React.Dispatch<AppAction> {
  return useContext(AppDispatchContext)
}
