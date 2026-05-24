import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useAppState, useAppDispatch } from '@/context'
import CategoryItem from './CategoryItem'
import CategoryListSkeleton from './CategoryListSkeleton'
import useHydration from '@/shared/hooks/useHydration'

interface CategoryFilterSheetProps {
  isOpen: boolean
  onClose: () => void
}

export default function CategoryFilterSheet({ isOpen, onClose }: CategoryFilterSheetProps) {
  const navigate = useNavigate()
  const { categories } = useAppState()
  const dispatch = useAppDispatch()
  const hasHydrated = useHydration()

  const handleShowAll = () => {
    dispatch({ type: 'categories/select', payload: null })
    onClose()
  }

  return (
    <div className="pb-4">
      {hasHydrated ? (
        <>
          {/* Show all button */}
          <button
            onClick={handleShowAll}
            className="w-full flex items-center gap-3 px-2 py-3 text-[#8E8E93] hover:text-white text-base min-h-[44px] active:scale-[0.98] transition-transform"
          >
            <span className="text-lg">🐇</span>
            <span>all tasks</span>
          </button>

          <div className="flex flex-col gap-1">
            {categories.map((cat, index) => (
              <CategoryItem
                key={cat.id}
                index={index}
                category={cat}
                onSelect={onClose}
              />
            ))}
          </div>

          {/* Add category */}
          <button
            onClick={() => {
              onClose()
              navigate('/categories/create')
            }}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-[#2C2C2E] hover:bg-[#3A3A3C] text-white rounded-[14px] min-h-[44px] font-medium active:scale-95 transition-all"
          >
            <Plus size={18} />
            new category
          </button>
        </>
      ) : (
        <CategoryListSkeleton />
      )}
    </div>
  )
}
