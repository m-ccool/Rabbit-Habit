import { forwardRef, ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-150 active:scale-95 disabled:pointer-events-none disabled:opacity-50 min-h-[44px] min-w-[44px] select-none',
  {
    variants: {
      variant: {
        default:     'bg-[#FF375F] text-white hover:bg-[#FF375F]/90 rounded-squircle',
        secondary:   'bg-[#2C2C2E] text-white hover:bg-[#3A3A3C] rounded-squircle',
        ghost:       'text-white hover:bg-white/10 rounded-squircle',
        destructive: 'bg-[#FF453A] text-white hover:bg-[#FF453A]/90 rounded-squircle',
        outline:     'border border-white/20 text-white hover:bg-white/10 rounded-squircle',
        glass:       'liquid-glass text-white rounded-squircle',
      },
      size: {
        default: 'h-11 px-5 text-sm',
        sm:      'h-9 px-3 text-sm rounded-xl',
        lg:      'h-14 px-8 text-base',
        icon:    'h-11 w-11 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size:    'default',
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
)
Button.displayName = 'Button'

export { Button, buttonVariants }
