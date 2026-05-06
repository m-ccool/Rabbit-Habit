import useGlobalStore from "@/store"

/**
 * Selector hook for category data and CRUD actions.
 */
const useCategories = () => {
  const {
    categories,
    selectedCategory,
    addCategory,
    deleteCategory,
    updateSelectedCategory,
  } = useGlobalStore()

  return {
    categories,
    selectedCategory,
    addCategory,
    deleteCategory,
    updateSelectedCategory,
  }
}

export default useCategories
