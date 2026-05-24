import { InputHTMLAttributes } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export default function FormInput({ label, error, className, ...rest }: FormInputProps) {
  return (
    <div className="w-full flex flex-col gap-2">
      {label ? (
        <label className="text-white text-base font-medium">{label}</label>
      ) : null}
      <Input className={cn(className)} {...rest} />
      {error ? (
        <p className="text-[#FF453A] text-sm">{error}</p>
      ) : null}
    </div>
  )
}

