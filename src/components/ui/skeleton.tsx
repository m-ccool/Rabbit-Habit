import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-[14px] bg-[#2C2C2E]', className)}
      {...props}
    />
  )
}

export { Skeleton }
