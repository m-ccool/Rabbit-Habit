import { Fragment, ReactNode, useEffect } from 'react'
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { cn } from '@/lib/utils'
import { useSheetContext } from './NativeLayout'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  className?: string
}

export default function BottomSheet({ isOpen, onClose, children, className }: BottomSheetProps) {
  const { openSheet, closeSheet } = useSheetContext()

  // Sync open state into NativeLayout for stack-scale
  useEffect(() => {
    if (isOpen) {
      openSheet()
    } else {
      closeSheet()
    }
    return () => closeSheet()
  // openSheet / closeSheet are stable refs — exhaustive-deps warning is safe to suppress
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const handleClose = () => {
    closeSheet()
    onClose()
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        {/* Backdrop — opacity + blur animate together */}
        <TransitionChild
          as={Fragment}
          enter="transition-[opacity,backdrop-filter] ease-out duration-300"
          enterFrom="opacity-0 backdrop-blur-none"
          enterTo="opacity-100 backdrop-blur-[16px]"
          leave="transition-[opacity,backdrop-filter] ease-in duration-200"
          leaveFrom="opacity-100 backdrop-blur-[16px]"
          leaveTo="opacity-0 backdrop-blur-none"
        >
          <div className="fixed inset-0 bg-black/55" />
        </TransitionChild>

        {/* Slide-up panel */}
        <div className="fixed inset-0 flex items-end pointer-events-none">
          <TransitionChild
            as={Fragment}
            enter="duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            enterFrom="translate-y-full"
            enterTo="translate-y-0"
            leave="duration-200 ease-in"
            leaveFrom="translate-y-0"
            leaveTo="translate-y-full"
          >
            <DialogPanel
              className={cn(
                'liquid-glass w-full rounded-t-[22px] px-4 pt-5 max-h-[80vh] overflow-y-auto pointer-events-auto',
                className
              )}
              style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 16px), 24px)' }}
            >
              {/* Drag handle */}
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/30" />
              {children}
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  )
}
