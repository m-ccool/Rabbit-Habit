import CategorySkeleton from '@/shared/components/skeletons/CategorySkeleton'

export default function CategoryListSkeleton() {
  return (
    <div className="flex flex-col gap-1">
      {[...Array(4)].map((_, i) => (
        <CategorySkeleton key={i} />
      ))}
    </div>
  )
}
