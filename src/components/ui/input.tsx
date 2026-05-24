import { forwardRef, InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    className={cn(
      'flex w-full min-h-[44px] rounded-[14px] bg-[#2C2C2E] px-4 py-3 text-base text-white placeholder:text-[#636366] outline-none ring-1 ring-transparent focus:ring-[#FF375F]/50 disabled:cursor-not-allowed disabled:opacity-50 transition-shadow',
      className
    )}
    {...props}
  />
))
Input.displayName = 'Input'

export { Input }
