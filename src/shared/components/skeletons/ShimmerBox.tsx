import React, { useEffect, useRef } from "react"
import { Animated, ViewStyle } from "react-native"

interface ShimmerBoxProps {
  style?: ViewStyle
}

/**
 * A single shimmer rectangle that pulses between two gray tones.
 */
export const ShimmerBox = ({ style }: ShimmerBoxProps) => {
  const anim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    )
    animation.start()
    return () => animation.stop()
  }, [anim])

  const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.7] })

  return (
    <Animated.View
      style={[{ opacity, backgroundColor: "#2C2C2E", borderRadius: 8 }, style]}
    />
  )
}
