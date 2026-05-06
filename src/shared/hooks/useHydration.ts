import useGlobalStore from "@/store"

/**
 * Returns true once Zustand has finished rehydrating persisted state
 * from AsyncStorage on app cold start.
 */
const useHydration = () => {
  return useGlobalStore((state) => state._hasHydrated)
}

export default useHydration
