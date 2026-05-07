import React, { useEffect, useRef } from "react"
import { Modal, StyleSheet, Dimensions } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  runOnJS,
} from "react-native-reanimated"
import useGlobalStore from "@/store"

const { width: SCREEN_WIDTH } = Dimensions.get("window")

const NUM_CARROTS = 6

type CarrotRewardOverlayProps = {
  visible: boolean
  onHide: () => void
}

type CarrotAnimProps = {
  index: number
  onDone?: () => void
}

const CarrotParticle = ({ index, onDone }: CarrotAnimProps) => {
  const startX = SCREEN_WIDTH / 2 + (Math.random() - 0.5) * 200
  const endX = startX + (Math.random() - 0.5) * 120
  const translateY = useSharedValue(0)
  const translateX = useSharedValue(startX)
  const opacity = useSharedValue(1)
  const scale = useSharedValue(0.5)

  useEffect(() => {
    const delay = index * 80
    translateY.value = withDelay(delay, withTiming(-220, { duration: 900 }))
    translateX.value = withDelay(delay, withTiming(endX, { duration: 900 }))
    opacity.value = withDelay(delay + 500, withTiming(0, { duration: 400 }, (finished) => {
      if (finished && index === NUM_CARROTS - 1 && onDone) {
        runOnJS(onDone)()
      }
    }))
    scale.value = withDelay(delay, withSpring(1))
  }, [])

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
    position: "absolute",
    bottom: 80,
  }))

  return (
    <Animated.Text style={[styles.carrot, style]}>🥕</Animated.Text>
  )
}

const CarrotRewardOverlay = ({ visible, onHide }: CarrotRewardOverlayProps) => {
  const { carrots } = useGlobalStore()
  const textOpacity = useSharedValue(0)
  const textScale = useSharedValue(0.5)
  const doneCount = useRef(0)

  useEffect(() => {
    if (visible) {
      doneCount.current = 0
      textOpacity.value = withDelay(200, withSpring(1))
      textScale.value = withDelay(200, withSpring(1))
      // auto-hide after 2s
      const timer = setTimeout(() => {
        textOpacity.value = withTiming(0, { duration: 300 })
        textScale.value = withTiming(0.5, { duration: 300 })
        setTimeout(onHide, 300)
      }, 2000)
      return () => clearTimeout(timer)
    } else {
      textOpacity.value = 0
      textScale.value = 0.5
    }
  }, [visible])

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ scale: textScale.value }],
  }))

  if (!visible) return null

  return (
    <Modal transparent animationType="none" visible={visible}>
      <Animated.View style={styles.container} pointerEvents="none">
        {Array.from({ length: NUM_CARROTS }).map((_, i) => (
          <CarrotParticle key={i} index={i} />
        ))}
        <Animated.Text style={[styles.earnedText, textStyle]}>
          5 CARROTS EARNED
        </Animated.Text>
      </Animated.View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 80,
  },
  carrot: {
    fontSize: 32,
    left: 0,
  },
  earnedText: {
    color: "#ec4899",
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 40,
  },
})

export default CarrotRewardOverlay
