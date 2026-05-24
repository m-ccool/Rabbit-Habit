import { Fragment } from 'react'
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { X } from 'lucide-react'
import { useAppState } from '@/context'

interface BadgesModalProps {
  visible: boolean
  onClose: () => void
}

export default function BadgesModal({ visible, onClose }: BadgesModalProps) {
  const { badges } = useAppState()

  return (
    <Transition appear show={visible} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 flex items-center justify-center p-6">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
            leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="liquid-glass w-full max-w-sm rounded-[22px] p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[#ec4899] text-xl font-bold">earn bunny badges</h2>
                <button
                  onClick={onClose}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#636366] hover:text-white active:scale-95 transition-transform"
                  aria-label="Close"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="flex flex-col gap-4 max-h-[50vh] overflow-y-auto">
                {badges.map(badge => (
                  <div key={badge.id} className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0 ${
                        badge.unlocked
                          ? 'bg-[#30D158]'
                          : 'border-2 border-[#3A3A3C]'
                      }`}
                    >
                      {badge.icon}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-white text-base font-medium capitalize">{badge.name}</span>
                      <span className="text-[#8E8E93] text-sm">{badge.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  )
}
