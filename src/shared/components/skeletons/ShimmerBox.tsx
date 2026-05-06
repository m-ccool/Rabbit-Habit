import React, { useEffect, useRef } from "react"
import { Animated, StyleSheet, View, ViewStyle } from "react-native"

interface ShimmerBoxProps {
  style?: ViewStyle
}

/**
 * A single shimmer rectangle that pulses between two gray tones.
 * Zero external dependencies — uses React Native's Animated API.
 */
export const ShimmerBox = ({ style }: ShimmerBoxProps) => {
  const anim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start()
  }, [anim])

  const opacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0.7],
  })

  return (
    <Animated.View style={[styles.shimmer, { opacity }, style]} />
  )
}

const styles = StyleSheet.create({
  shimmer: {
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
  },
})
