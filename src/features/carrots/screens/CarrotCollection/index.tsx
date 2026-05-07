import useGlobalStore from "@/store"
import { useNavigation } from "@react-navigation/native"
import React from "react"
import { Pressable, StyleSheet, View, Text as RNText } from "react-native"

const CarrotCollection = () => {
  const { carrots } = useGlobalStore()
  const navigation = useNavigation()
  const collected = Math.floor(carrots / 10)
  const remaining = 10 - (carrots % 10)

  return (
    <View style={styles.root}>
      {/* Back */}
      <Pressable onPress={() => navigation.goBack()} style={styles.backBtn} accessibilityRole="button">
        <RNText style={styles.backText}>← back</RNText>
      </Pressable>

      {/* Collected counter */}
      <RNText style={styles.collected}>{collected} / {collected + 1} collected</RNText>

      {/* Mascots */}
      <RNText style={styles.carrotEmoji}>🥕</RNText>
      <RNText style={styles.rabbitEmoji}>🐇</RNText>

      {/* Title */}
      <RNText style={styles.title}>RABBIT HABIT</RNText>
      <RNText style={styles.subtitle}>habit tracker</RNText>

      {/* CTA */}
      <RNText style={styles.cta}>jump to feed the rabbit !</RNText>

      {/* Carrot count */}
      <RNText style={styles.carrotCount}>{carrots.toLocaleString()} CARROTS EARNED</RNText>

      {/* Progress hint */}
      <RNText style={styles.hint}>{remaining} more carrots until next rabbit is fed</RNText>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  backBtn: {
    position: "absolute",
    top: 56,
    left: 20,
    padding: 8,
  },
  backText: {
    color: "#8E8E93",
    fontSize: 15,
  },
  collected: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 28,
    letterSpacing: 0.5,
  },
  carrotEmoji: {
    fontSize: 64,
    marginBottom: 4,
  },
  rabbitEmoji: {
    fontSize: 64,
    marginBottom: 24,
  },
  title: {
    color: "#FF375F",
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 4,
  },
  subtitle: {
    color: "#8E8E93",
    fontSize: 13,
    letterSpacing: 0.5,
    marginBottom: 28,
  },
  cta: {
    color: "#8E8E93",
    fontSize: 15,
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  carrotCount: {
    color: "#FF375F",
    fontWeight: "700",
    fontSize: 18,
    letterSpacing: 1,
    marginBottom: 10,
  },
  hint: {
    color: "#636366",
    fontSize: 13,
    textAlign: "center",
  },
})

export default CarrotCollection
