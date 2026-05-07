import useGlobalStore from "@/store"
import { Box, Text } from "@/shared/utils/theme"
import { useNavigation } from "@react-navigation/native"
import React from "react"
import { Pressable, StyleSheet } from "react-native"

const CarrotCollection = () => {
  const { carrots } = useGlobalStore()
  const navigation = useNavigation()
  const collected = Math.floor(carrots / 10)
  const nextTarget = (collected + 1) * 10

  return (
    <Box flex={1} bg="dark900" alignItems="center" justifyContent="center" px="6">
      <Text variant="text2Xl" style={styles.header}>
        {collected} / {collected + 1} collected
      </Text>

      {/* Mascots */}
      <Text style={styles.mascots}>🥕</Text>
      <Text style={styles.mascots}>🐇</Text>

      <Text variant="textBase" color="gray200" style={styles.cta}>
        jump to feed the rabbit !
      </Text>

      <Text variant="textXl" style={styles.carrotCount}>
        {carrots.toLocaleString()} CARROTS EARNED
      </Text>

      <Text variant="textBase" color="gray200" style={styles.subtitle}>
        {nextTarget - carrots} more carrots until next rabbit is fed
      </Text>

      <Pressable onPress={() => navigation.goBack()} style={styles.backBtn} accessibilityRole="button">
        <Text variant="textBase" color="gray200">
          ← back
        </Text>
      </Pressable>
    </Box>
  )
}

const styles = StyleSheet.create({
  header: {
    color: "#ffffff",
    fontWeight: "bold",
    marginBottom: 24,
  },
  mascots: {
    fontSize: 64,
    marginVertical: 8,
  },
  cta: {
    marginTop: 24,
    marginBottom: 8,
  },
  carrotCount: {
    color: "#ec4899",
    fontWeight: "bold",
    letterSpacing: 1,
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 40,
  },
  backBtn: {
    borderWidth: 1,
    borderColor: "#3a3a46",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
})

export default CarrotCollection
