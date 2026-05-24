import { Box } from "@/shared/utils/theme"
import { useNavigation } from "@react-navigation/native"
import React, { useEffect, useRef } from "react"
import { Animated, Platform, Pressable, StyleSheet } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { MaterialCommunityIcons } from "@expo/vector-icons"

/**
 * Floating action button that navigates to the Create Task screen.
 * Includes an idle pulse ring and a spring-scale pop on press.
 */
const FloatingActionButton = () => {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()
  const isAndroid = Platform.OS === "android"

  const scaleAnim   = useRef(new Animated.Value(1)).current
  const pulseScale  = useRef(new Animated.Value(1)).current
  const pulseOpacity = useRef(new Animated.Value(0.55)).current

  // Idle pulse ring — loops every 2 s
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseScale,   { toValue: 1.75, duration: 1100, useNativeDriver: true }),
          Animated.timing(pulseOpacity, { toValue: 0,    duration: 1100, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(pulseScale,   { toValue: 1, duration: 0, useNativeDriver: true }),
          Animated.timing(pulseOpacity, { toValue: 0.55, duration: 0, useNativeDriver: true }),
        ]),
        Animated.delay(900),
      ])
    )
    loop.start()
    return () => loop.stop()
  }, [pulseScale, pulseOpacity])

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue:      0.87,
      useNativeDriver: true,
      speed:        50,
      bounciness:   0,
    }).start()
  }

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue:      1,
      useNativeDriver: true,
      speed:        18,
      bounciness:   16,
    }).start()
  }

  return (
    <Box
      position="absolute"
      bottom={insets.bottom + (isAndroid ? 100 : 40)}
      right={20}
    >
      {/* Idle pulse ring */}
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFillObject,
          styles.pulseRing,
          { transform: [{ scale: pulseScale }], opacity: pulseOpacity },
        ]}
      />

      <Pressable
        onPress={() => navigation.navigate("CreateTask")}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityLabel="Create new task"
      >
        <Animated.View style={[styles.button, { transform: [{ scale: scaleAnim }] }]}>
          <MaterialCommunityIcons name="plus" size={40} color="#ffffff" />
        </Animated.View>
      </Pressable>
    </Box>
  )
}

const styles = StyleSheet.create({
  pulseRing: {
    width:        64,
    height:       64,
    borderRadius: 32,
    borderWidth:  2,
    borderColor:  '#FF375F',
  },
  button: {
    width:           64,
    height:          64,
    borderRadius:    32,
    backgroundColor: '#FF375F',
    alignItems:      'center',
    justifyContent:  'center',
  },
})

export default FloatingActionButton
