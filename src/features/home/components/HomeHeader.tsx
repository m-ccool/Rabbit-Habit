import { Box, Text } from "@/shared/utils/theme"
import useGlobalStore from "@/store"
import { Ionicons } from "@expo/vector-icons"
import { BottomSheetModal } from "@gorhom/bottom-sheet"
import { useNavigation, DrawerActions } from "@react-navigation/native"
import React, { useState } from "react"
import { Pressable, StyleSheet } from "react-native"
import BadgesModal from "@/features/badges/components/BadgesModal"

type HomeHeaderProps = {
  bottomSheetRef: RefObject<BottomSheetModal>
}

import { RefObject } from "react"

const HomeHeader = ({ bottomSheetRef }: HomeHeaderProps) => {
  const { badges, carrots } = useGlobalStore()
  const navigation = useNavigation()
  const [badgesVisible, setBadgesVisible] = useState(false)

  return (
    <>
      <Box px="4" pt="4">
        {/* Row 1: hamburger | title | carrots + rabbit */}
        <Box flexDirection="row" alignItems="center" justifyContent="space-between" mb="3">
          <Pressable
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            accessibilityRole="button"
            accessibilityLabel="Open menu"
          >
            <Ionicons name="menu" size={28} color="#ffffff" />
          </Pressable>

          <Box alignItems="center">
            <Text variant="textXl" style={styles.title}>
              RABBIT HABIT
            </Text>
            <Text variant="textBase" color="gray200" style={styles.subtitle}>
              habit tracker
            </Text>
          </Box>

          <Pressable
            onPress={() => navigation.navigate("CarrotCollection")}
            accessibilityRole="button"
            accessibilityLabel="Carrot collection"
            style={styles.mascotRow}
          >
            <Text style={styles.mascot}>🥕</Text>
            <Text style={styles.mascot}>🐇</Text>
          </Pressable>
        </Box>

        {/* Row 2: badge circles */}
        <Box flexDirection="row" justifyContent="center" mb="2">
          {badges.map((badge) => (
            <Pressable
              key={badge.id}
              onPress={() => setBadgesVisible(true)}
              accessibilityRole="button"
              accessibilityLabel={`${badge.name} badge`}
              style={[
                styles.badgeCircle,
                badge.unlocked ? styles.badgeUnlocked : styles.badgeLocked,
              ]}
            >
              <Text style={styles.badgeIcon}>{badge.icon}</Text>
            </Pressable>
          ))}
        </Box>

        {/* Category filter row */}
        <Box flexDirection="row" alignItems="center" justifyContent="flex-end" mt="2">
          <Pressable
            onPress={() => bottomSheetRef.current?.present()}
            accessibilityRole="button"
            accessibilityLabel="Filter by category"
          >
            <Ionicons size={28} name="ios-filter" color="#ffffff" />
          </Pressable>
        </Box>
      </Box>

      <BadgesModal visible={badgesVisible} onClose={() => setBadgesVisible(false)} />
    </>
  )
}

const styles = StyleSheet.create({
  title: {
    color: "#ffffff",
    fontWeight: "bold",
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 12,
  },
  mascotRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  mascot: {
    fontSize: 20,
    marginLeft: 2,
  },
  badgeCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 6,
  },
  badgeLocked: {
    borderColor: "#3a3a46",
    backgroundColor: "transparent",
  },
  badgeUnlocked: {
    borderColor: "#ec4899",
    backgroundColor: "#ec489922",
  },
  badgeIcon: {
    fontSize: 20,
  },
})

export default HomeHeader
