import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface ShimmerBoxProps extends HTMLAttributes<HTMLDivElement> {}

export function ShimmerBox({ className, ...props }: ShimmerBoxProps) {
  return (
    <div
      className={cn('shimmer-box', className)}
      {...props}
    />
  )
}
