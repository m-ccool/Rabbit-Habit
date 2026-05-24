import { useAppState } from '@/context'

export default function useHydration() {
  return useAppState()._hasHydrated
}
