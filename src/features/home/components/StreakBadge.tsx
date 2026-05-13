import React from "react"
import { StyleSheet } from "react-native"
import { Box, Text } from "@/shared/utils/theme"
import useGlobalStore from "@/store"

const StreakBadge = () => {
  const currentStreak = useGlobalStore((s) => s.currentStreak)

  if (currentStreak === 0) return null

  return (
    <Box style={styles.pill} marginLeft="4" marginTop="2">
      <Text style={styles.fire}>🔥</Text>
      <Text variant="textBase" color="gray200" style={styles.label}>
        {currentStreak} day{currentStreak !== 1 ? "s" : ""} streak
      </Text>
    </Box>
  )
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: "#2C2C2E",
  },
  fire: { fontSize: 16 },
  label: { marginLeft: 4 },
})

export default StreakBadge
