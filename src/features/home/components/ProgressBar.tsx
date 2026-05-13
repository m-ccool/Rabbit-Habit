import React, { useEffect } from "react"
import { Platform, StyleSheet } from "react-native"
import Animated, {
  FadeIn,
  FadeOut,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated"
import useGlobalStore from "@/store"
import { Box, Text } from "@/shared/utils/theme"
import { palette } from "@/shared/utils/theme/colors"

type ProgressBarProps = {
  onAllComplete?: () => void
}

const getRabbitMood = (progress: number, total: number) => {
  if (total === 0) return { emoji: "😴", label: "Add some tasks!" }
  if (progress === 0) return { emoji: "🐰", label: "Ready to start?" }
  if (progress < 0.5) return { emoji: "⚡", label: "Keep going!" }
  if (progress < 1) return { emoji: "🌟", label: "Almost there!" }
  return { emoji: "🎉", label: "You did it!" }
}

const ProgressBar = ({ onAllComplete }: ProgressBarProps) => {
  const { tasks, selectedCategory, checkAndUpdateStreak } = useGlobalStore()

  const filtered = selectedCategory
    ? tasks.filter((t) => t.category_id === selectedCategory.id)
    : tasks

  const total = filtered.length
  const completed = filtered.filter((t) => t.completed).length
  const progress = total > 0 ? completed / total : 0

  const animatedWidth = useSharedValue(0)

  useEffect(() => {
    animatedWidth.value = withSpring(progress, {
      damping: 18,
      stiffness: 120,
    })
  }, [progress])

  const triggerSuccess = async () => {
    if (Platform.OS === "web") return

    const Haptics = require("expo-haptics")
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
  }

  useEffect(() => {
    if (total > 0 && completed === total) {
      checkAndUpdateStreak()
      onAllComplete?.()
      triggerSuccess()
    }
  }, [completed, total])

  const barStyle = useAnimatedStyle(() => ({
    width: `${animatedWidth.value * 100}%`,
    backgroundColor: interpolateColor(
      animatedWidth.value,
      [0, 0.5, 1],
      [palette.systemRed, palette.systemYellow, palette.systemGreen]
    ),
  }))

  const { emoji, label } = getRabbitMood(progress, total)

  return (
    <Box paddingHorizontal="4" paddingTop="3" paddingBottom="1">
      {/* Mascot row */}
      <Box flexDirection="row" alignItems="center" justifyContent="space-between" marginBottom="2">
        <Box flexDirection="row" alignItems="center">
          <Text style={styles.emoji}>{emoji}</Text>
          <Text variant="textBase" color="gray200" marginLeft="2">{label}</Text>
        </Box>
        <Text variant="textBase" color="gray200">{completed}/{total}</Text>
      </Box>

      {/* Track */}
      <Box style={styles.track}>
        <Animated.View style={[styles.bar, barStyle]} />
      </Box>

      {/* Trophy badge — only when all done */}
      {total > 0 && completed === total && (
        <Animated.View
          entering={FadeIn.duration(400)}
          exiting={FadeOut.duration(300)}
          style={styles.trophy}
        >
          <Text style={styles.trophyEmoji}>🏆</Text>
          <Text variant="textBase" style={{ color: palette.systemGreen, fontWeight: "600" }}>
            Daily Complete!
          </Text>
        </Animated.View>
      )}
    </Box>
  )
}

const styles = StyleSheet.create({
  emoji: { fontSize: 28 },
  track: {
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "#3A3A3C",
  },
  bar: {
    height: "100%",
    borderRadius: 5,
  },
  trophy: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    gap: 4,
  },
  trophyEmoji: { fontSize: 18 },
})

export default ProgressBar
