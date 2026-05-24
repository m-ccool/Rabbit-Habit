import { useEffect, useRef, useState } from 'react'

const PARTICLES = [
  { emoji: '🥕', weight: 5 },
  { emoji: '✨', weight: 3 },
  { emoji: '🌟', weight: 2 },
]

function pickEmoji() {
  const pool = PARTICLES.flatMap(({ emoji, weight }) => Array(weight).fill(emoji))
  return pool[Math.floor(Math.random() * pool.length)]
}

const NUM_PARTICLES = 12

interface ParticleProps {
  index: number
  visible: boolean
}

function Particle({ index, visible }: ParticleProps) {
  const angle   = (index / NUM_PARTICLES) * 360 + (Math.random() - 0.5) * 30
  const dist    = 80 + Math.random() * 80
  const endX    = Math.cos((angle * Math.PI) / 180) * dist
  const endY    = Math.sin((angle * Math.PI) / 180) * dist - 60
  const emoji   = useRef(pickEmoji()).current
  const delay   = index * 55
  const size    = 22 + Math.floor(Math.random() * 18)

  return (
    <span
      className="pointer-events-none absolute"
      style={{
        left:                    '50%',
        top:                     '50%',
        fontSize:                size,
        animationName:           visible ? 'particle-burst' : 'none',
        animationDuration:       '900ms',
        animationDelay:          `${delay}ms`,
        animationFillMode:       'both',
        animationTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        '--tx': `${endX}px`,
        '--ty': `${endY}px`,
      } as React.CSSProperties}
    >
      {emoji}
    </span>
  )
}

interface CarrotRewardOverlayProps {
  visible: boolean
  onHide: () => void
}

export default function CarrotRewardOverlay({ visible, onHide }: CarrotRewardOverlayProps) {
  const [show, setShow] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (visible) {
      setShow(true)
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        setShow(false)
        onHide()
      }, 2200)
    }
    return () => clearTimeout(timerRef.current)
  }, [visible, onHide])

  if (!show) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* Flash burst ring */}
      <span
        className="absolute rounded-full border-2 border-[#FF375F]/60"
        style={{
          width: 120,
          height: 120,
          animation: 'ring-burst 600ms ease-out both',
        }}
      />

      {/* Particles */}
      {Array.from({ length: NUM_PARTICLES }).map((_, i) => (
        <Particle key={i} index={i} visible={show} />
      ))}

      {/* Reward text */}
      <p
        className="relative text-2xl font-bold text-[#FF375F] tracking-widest animate-reward-pop"
        style={{ textShadow: '0 0 20px rgba(255,55,95,0.6)' }}
      >
        +5 CARROTS 🥕
      </p>

      <style>{`
        @keyframes particle-burst {
          0%   { transform: translate(-50%, -50%) scale(0.3); opacity: 1; }
          80%  { opacity: 0.8; }
          100% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1); opacity: 0; }
        }
        @keyframes ring-burst {
          0%   { transform: scale(0.2); opacity: 0.9; }
          100% { transform: scale(3.5); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

