import { ShimmerBox } from './ShimmerBox'

export default function TaskSkeleton() {
  return (
    <div className="mx-4 my-1.5">
      <div className="bg-[#1C1C1E] rounded-[16px] p-4">
        <div className="flex items-center gap-3">
          <ShimmerBox className="w-7 h-7 rounded-full" />
          <ShimmerBox className="flex-1 h-5" />
        </div>
      </div>
    </div>
  )
}
