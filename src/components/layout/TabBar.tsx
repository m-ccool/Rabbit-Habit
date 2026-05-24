import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Cherry, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { to: '/',        label: 'home',    Icon: Home },
  { to: '/carrots', label: 'carrots', Icon: Cherry },
  { to: '/profile', label: 'profile', Icon: User },
]

export default function TabBar() {
  const [bouncingTab, setBouncingTab] = useState<string | null>(null)

  const handleTabClick = (to: string) => {
    setBouncingTab(to)
    setTimeout(() => setBouncingTab(null), 420)
  }

  return (
    <nav
      className="liquid-glass border-t border-white/10 shrink-0"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 16px)' }}
    >
      <div className="flex">
        {tabs.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={() => handleTabClick(to)}
            className={({ isActive }) =>
              cn(
                'relative flex flex-1 flex-col items-center justify-center gap-[3px] min-h-[44px] py-3 text-[10px] font-medium tracking-wide transition-colors duration-200',
                isActive ? 'text-[#FF375F]' : 'text-[#636366]'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  className={cn(
                    'transition-transform duration-200',
                    bouncingTab === to && 'animate-tab-bounce'
                  )}
                />
                <span className={cn('transition-opacity duration-200', isActive ? 'opacity-100' : 'opacity-60')}>
                  {label}
                </span>

                {/* Active indicator pill */}
                {isActive && (
                  <span
                    className="absolute bottom-[6px] left-1/2 -translate-x-1/2 w-4 h-[3px] rounded-full bg-[#FF375F] origin-center animate-indicator-grow"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
