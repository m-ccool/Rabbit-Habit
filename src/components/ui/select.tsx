import { forwardRef, SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        'flex w-full min-h-[44px] rounded-[14px] bg-[#2C2C2E] px-4 py-3 text-base text-white outline-none ring-1 ring-transparent focus:ring-[#FF375F]/50 disabled:opacity-50 appearance-none transition-shadow',
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
)
Select.displayName = 'Select'

export { Select }
