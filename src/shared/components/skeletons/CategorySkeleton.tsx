import { ShimmerBox } from './ShimmerBox'

export default function CategorySkeleton() {
  return (
    <div className="flex items-center gap-4 px-4 py-3">
      <ShimmerBox className="w-8 h-8 rounded-full" />
      <ShimmerBox className="flex-1 h-5" />
    </div>
  )
}
