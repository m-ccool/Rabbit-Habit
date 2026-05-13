import React, { useEffect } from "react"
import { Dimensions, StyleSheet } from "react-native"
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated"

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

const COLORS = [
  "#ff2d55",
  "#007aff",
  "#30d158",
  "#ffcc00",
  "#af52de",
  "#ff9500",
  "#5ac8fa",
  "#ff375f",
]

const PARTICLE_COUNT = 22

type ParticleProps = {
  index: number
  onLastDone?: () => void
  isLast: boolean
}

const Particle = ({ index, onLastDone, isLast }: ParticleProps) => {
  const translateY = useSharedValue(-30)
  const opacity = useSharedValue(1)
  const rotate = useSharedValue(0)

  const delay = (index % 8) * 80
  const x = (index / PARTICLE_COUNT) * SCREEN_WIDTH + Math.random() * 20 - 10
  const color = COLORS[index % COLORS.length]
  const isWide = index % 3 === 0

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withTiming(SCREEN_HEIGHT + 40, { duration: 2000 })
    )
    rotate.value = withDelay(
      delay,
      withTiming(720, { duration: 2200 })
    )
    opacity.value = withDelay(
      delay + 1600,
      withTiming(0, { duration: 400 }, (finished) => {
        if (finished && isLast && onLastDone) {
          runOnJS(onLastDone)()
        }
      })
    )
  }, [])

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }))

  return (
    <Animated.View
      style={[
        styles.particle,
        style,
        {
          left: x,
          backgroundColor: color,
          width: isWide ? 10 : 6,
          height: isWide ? 6 : 12,
          borderRadius: isWide ? 2 : 1,
        },
      ]}
    />
  )
}

type ConfettiOverlayProps = {
  visible: boolean
  onDone: () => void
}

const ConfettiOverlay = ({ visible, onDone }: ConfettiOverlayProps) => {
  if (!visible) return null

  return (
    <>
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
        <Particle
          key={i}
          index={i}
          isLast={i === PARTICLE_COUNT - 1}
          onLastDone={onDone}
        />
      ))}
    </>
  )
}

const styles = StyleSheet.create({
  particle: {
    position: "absolute",
    top: 0,
  },
})

export default ConfettiOverlay
