import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import TabBar from './TabBar'

// ── Sheet context (drives stack-scale effect) ─────────────────────────────────
interface SheetContextValue {
  sheetOpen: boolean
  openSheet: () => void
  closeSheet: () => void
}

const SheetContext = createContext<SheetContextValue>({
  sheetOpen: false,
  openSheet: () => {},
  closeSheet: () => {},
})

export function useSheetContext() {
  return useContext(SheetContext)
}

// ── Layout ────────────────────────────────────────────────────────────────────
const DETAIL_PATTERN = /^\/(tasks|categories)/

export default function NativeLayout() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const location    = useLocation()
  const prevPathRef = useRef(location.pathname)

  // Compute slide direction synchronously so the correct class is on the
  // first render of the new route (before the ref update effect fires).
  const curr = location.pathname
  const prev = prevPathRef.current
  let enterClass: string
  if (DETAIL_PATTERN.test(curr)) {
    enterClass = 'animate-slide-from-right'
  } else if (DETAIL_PATTERN.test(prev) && !DETAIL_PATTERN.test(curr)) {
    enterClass = 'animate-slide-from-left'
  } else {
    enterClass = 'animate-page-enter'
  }

  // Update the ref after each navigation for the next direction computation
  useEffect(() => {
    prevPathRef.current = location.pathname
  }, [location.pathname])

  return (
    <SheetContext.Provider
      value={{
        sheetOpen,
        openSheet:  () => setSheetOpen(true),
        closeSheet: () => setSheetOpen(false),
      }}
    >
      <div className="flex flex-col h-screen bg-black overflow-hidden mesh-bg">
        {/* Page — scales back when a sheet is open (iOS stack effect) */}
        <div
          className={cn(
            'flex-1 overflow-hidden transition-all duration-300 ease-out origin-top',
            sheetOpen && 'scale-[0.95] rounded-[22px]'
          )}
        >
          {/* Route wrapper — direction-aware enter animation */}
          <div key={location.pathname} className={`h-full overflow-y-auto ${enterClass}`}>
            <Outlet />
          </div>
        </div>

        {/* Fixed tab bar */}
        <TabBar />
      </div>
    </SheetContext.Provider>
  )
}
