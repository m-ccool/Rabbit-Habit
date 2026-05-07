import useGlobalStore from "@/store"
import { DrawerContentComponentProps } from "@react-navigation/drawer"
import React from "react"
import { Pressable, StyleSheet, Linking, View, Text as RNText } from "react-native"

const ProfileDrawer = (props: DrawerContentComponentProps) => {
  const { user, carrots, themeMode, toggleTheme, logout } = useGlobalStore()

  const handleLogout = () => {
    logout()
    props.navigation.closeDrawer()
  }

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <RNText style={styles.appTitle}>RABBIT HABIT</RNText>
        <RNText style={styles.appSubtitle}>habit tracker</RNText>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Settings list */}
      <View style={styles.section}>
        {/* Theme toggle row */}
        <View style={styles.row}>
          <RNText style={styles.rowIcon}>☀️</RNText>
          <RNText style={styles.rowLabel}>theme :</RNText>
          <Pressable onPress={toggleTheme} accessibilityRole="switch" style={styles.rowValue}>
            <RNText style={styles.rowValueText}>{themeMode}</RNText>
          </Pressable>
        </View>

        {/* GitHub row */}
        <View style={styles.row}>
          <RNText style={styles.rowIcon}>⬡</RNText>
          <RNText style={styles.rowLabel}>dev team :</RNText>
          <Pressable
            onPress={() => Linking.openURL("https://github.com/m-ccool/Rabbit-Habit")}
            accessibilityRole="link"
            style={styles.rowValue}
          >
            <RNText style={styles.link}>github repository</RNText>
          </Pressable>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Carrot section */}
      <View style={styles.carrotSection}>
        <RNText style={styles.carrotEmoji}>🥕</RNText>
        <RNText style={styles.carrotCount}>{carrots.toLocaleString()} CARROTS EARNED</RNText>
      </View>

      {/* Username */}
      <RNText style={styles.username}>@ {user?.username ?? "user"}</RNText>

      {/* Spacer */}
      <View style={styles.spacer} />

      {/* Logout */}
      <Pressable onPress={handleLogout} style={styles.logoutBtn} accessibilityRole="button">
        <RNText style={styles.logoutText}>log out</RNText>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#1C1C1E",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  appTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 2,
  },
  appSubtitle: {
    color: "#8E8E93",
    fontSize: 13,
    letterSpacing: 0.5,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#38383A",
    marginVertical: 16,
  },
  section: {
    marginBottom: 0,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  rowIcon: {
    fontSize: 18,
    width: 26,
  },
  rowLabel: {
    color: "#8E8E93",
    fontSize: 15,
  },
  rowValue: {
    marginLeft: 4,
  },
  rowValueText: {
    color: "#FF375F",
    fontSize: 15,
    fontWeight: "600",
  },
  link: {
    color: "#0A84FF",
    fontSize: 15,
    textDecorationLine: "underline",
  },
  carrotSection: {
    alignItems: "flex-start",
    marginTop: 8,
  },
  carrotEmoji: {
    fontSize: 36,
    marginBottom: 6,
  },
  carrotCount: {
    color: "#FF375F",
    fontWeight: "700",
    fontSize: 17,
    letterSpacing: 0.5,
  },
  username: {
    color: "#8E8E93",
    fontSize: 15,
    marginTop: 12,
  },
  spacer: {
    flex: 1,
  },
  logoutBtn: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#3A3A3C",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: "flex-start",
  },
  logoutText: {
    color: "#8E8E93",
    fontSize: 15,
  },
})

export default ProfileDrawer
