import { Box, Text } from "@/shared/utils/theme"
import useGlobalStore from "@/store"
import { Ionicons } from "@expo/vector-icons"
import { BottomSheetModal } from "@gorhom/bottom-sheet"
import { useNavigation, DrawerActions } from "@react-navigation/native"
import React, { useState } from "react"
import { Pressable, StyleSheet, View } from "react-native"
import BadgesModal from "@/features/badges/components/BadgesModal"
import { RefObject } from "react"

// Map badge ids to iOS system colors
const BADGE_COLORS: Record<string, string> = {
  endure: "#FF9500",   // systemOrange
  heart:  "#30D158",   // systemGreen
  valor:  "#0A84FF",   // systemBlue
  stoic:  "#BF5AF2",   // systemPurple
}

type HomeHeaderProps = {
  bottomSheetRef: RefObject<BottomSheetModal>
}

const HomeHeader = ({ bottomSheetRef }: HomeHeaderProps) => {
  const { badges, carrots } = useGlobalStore()
  const navigation = useNavigation()
  const [badgesVisible, setBadgesVisible] = useState(false)

  return (
    <>
      <View style={styles.container}>
        {/* Row 1: hamburger | title | carrot+rabbit */}
        <View style={styles.row}>
          <Pressable
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            accessibilityRole="button"
            accessibilityLabel="Open menu"
            style={styles.iconBtn}
          >
            <Ionicons name="menu" size={28} color="#ffffff" />
          </Pressable>

          <View style={styles.titleGroup}>
            <Text variant="textXl" style={styles.title}>RABBIT HABIT</Text>
            <Text variant="textBase" color="gray200" style={styles.subtitle}>habit tracker</Text>
          </View>

          <Pressable
            onPress={() => navigation.navigate("CarrotCollection")}
            accessibilityRole="button"
            accessibilityLabel="Carrot collection"
            style={styles.mascotRow}
          >
            <Text style={styles.mascot}>🥕</Text>
            <Text style={styles.mascot}>🐇</Text>
          </Pressable>
        </View>

        {/* Row 2: badge row */}
        <View style={styles.badgeRow}>
          {badges.map((badge) => {
            const color = BADGE_COLORS[badge.id] ?? "#8E8E93"
            return (
              <View key={badge.id} style={styles.badgeItem}>
                <Text style={styles.badgeName}>{badge.name}</Text>
                <Pressable
                  onPress={() => setBadgesVisible(true)}
                  accessibilityRole="button"
                  accessibilityLabel={`${badge.name} badge`}
                  style={[
                    styles.badgeCircle,
                    badge.unlocked
                      ? { backgroundColor: color }
                      : { borderColor: color, borderWidth: 2 },
                  ]}
                >
                  <Text style={styles.badgeIcon}>{badge.icon}</Text>
                </Pressable>
              </View>
            )
          })}
        </View>

        {/* Row 3: section label + filter */}
        <View style={styles.sectionRow}>
          <Text variant="textBase" style={styles.sectionLabel}>active tasks</Text>
          <Pressable
            onPress={() => bottomSheetRef.current?.present()}
            accessibilityRole="button"
            accessibilityLabel="Filter by category"
            style={styles.iconBtn}
          >
            <Ionicons size={22} name="options-outline" color="#ffffff" />
          </Pressable>
        </View>
      </View>

      <BadgesModal visible={badgesVisible} onClose={() => setBadgesVisible(false)} />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  iconBtn: {
    padding: 4,
  },
  titleGroup: {
    alignItems: "center",
  },
  title: {
    color: "#ffffff",
    fontWeight: "700",
    letterSpacing: 2,
    fontSize: 18,
  },
  subtitle: {
    fontSize: 12,
    letterSpacing: 0.5,
  },
  mascotRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  mascot: {
    fontSize: 22,
    marginLeft: 2,
  },
  badgeRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  badgeItem: {
    alignItems: "center",
    marginBottom: 0,
  },
  badgeName: {
    fontSize: 10,
    color: "#8E8E93",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  badgeCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  badgeIcon: {
    fontSize: 22,
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 4,
  },
  sectionLabel: {
    fontSize: 13,
    color: "#8E8E93",
    letterSpacing: 0.8,
    textTransform: "lowercase",
  },
})

export default HomeHeader
