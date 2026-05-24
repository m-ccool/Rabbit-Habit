import { Trash2 } from 'lucide-react'
import { useAppState, useAppDispatch } from '@/context'
import { cn } from '@/lib/utils'

interface CategoryItemProps {
  category: ICategory
  index: number
  onSelect?: () => void
}

export default function CategoryItem({ category, index, onSelect }: CategoryItemProps) {
  const { selectedCategory } = useAppState()
  const dispatch = useAppDispatch()
  const isSelected = selectedCategory?.id === category.id

  const handleSelect = () => {
    dispatch({ type: 'categories/select', payload: isSelected ? null : category })
    onSelect?.()
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch({ type: 'categories/delete', payload: category.id })
  }

  return (
    <button
      onClick={handleSelect}
      className={cn(
        'flex items-center justify-between gap-3 w-full px-3 py-3 rounded-[14px] min-h-[44px] transition-all active:scale-[0.98]',
        isSelected ? 'bg-[#3A3A3C]' : 'hover:bg-[#2C2C2E]'
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-4 h-4 rounded-full shrink-0"
          style={{ backgroundColor: category.color.code || '#636366' }}
        />
        <span className="text-white text-base">{category.name}</span>
      </div>
      <button
        onClick={handleDelete}
        className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#636366] hover:text-[#FF453A] active:scale-95 transition-all"
        aria-label={`Delete ${category.name}`}
      >
        <Trash2 size={16} />
      </button>
    </button>
  )
}
