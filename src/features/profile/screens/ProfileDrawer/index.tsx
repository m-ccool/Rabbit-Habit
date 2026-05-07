import useGlobalStore from "@/store"
import { Box, Text } from "@/shared/utils/theme"
import { DrawerContentComponentProps } from "@react-navigation/drawer"
import React from "react"
import { Pressable, StyleSheet, Linking } from "react-native"

const ProfileDrawer = (props: DrawerContentComponentProps) => {
  const { user, carrots, themeMode, toggleTheme, logout } = useGlobalStore()

  const handleLogout = () => {
    logout()
    props.navigation.closeDrawer()
  }

  return (
    <Box flex={1} bg="dark800" px="6" py="10">
      {/* App title */}
      <Text variant="text2Xl" style={styles.appTitle}>
        RABBIT HABIT
      </Text>
      <Text variant="textBase" color="gray200" mb="8">
        habit tracker
      </Text>

      {/* Theme toggle */}
      <Box flexDirection="row" alignItems="center" mb="6">
        <Text variant="textBase" color="gray200" mr="3">
          theme :
        </Text>
        <Pressable onPress={toggleTheme} accessibilityRole="switch">
          <Text variant="textBase" style={styles.themeValue}>
            {themeMode === "dark" ? "dark" : "light"}
          </Text>
        </Pressable>
      </Box>

      {/* Dev team link */}
      <Box flexDirection="row" alignItems="center" mb="8">
        <Text variant="textBase" color="gray200" mr="3">
          dev team :
        </Text>
        <Pressable
          onPress={() => Linking.openURL("https://github.com/m-ccool/Rabbit-Habit")}
          accessibilityRole="link"
        >
          <Text variant="textBase" style={styles.link}>
            github repository
          </Text>
        </Pressable>
      </Box>

      {/* Carrot count */}
      <Box flexDirection="row" alignItems="center" mb="2">
        <Text style={styles.carrotEmoji}>🥕</Text>
      </Box>
      <Text variant="textXl" style={styles.carrotCount} mb="6">
        {carrots.toLocaleString()} CARROTS EARNED
      </Text>

      {/* Username */}
      <Text variant="textBase" color="gray200" mb="6">
        @ {user?.username ?? "user"}
      </Text>

      {/* Logout */}
      <Pressable onPress={handleLogout} style={styles.logoutBtn} accessibilityRole="button">
        <Text variant="textBase" color="gray200">
          log out
        </Text>
      </Pressable>
    </Box>
  )
}

const styles = StyleSheet.create({
  appTitle: {
    color: "#ffffff",
    fontWeight: "bold",
    letterSpacing: 2,
    marginBottom: 4,
  },
  themeValue: {
    color: "#ec4899",
  },
  link: {
    color: "#bfdbfe",
    textDecorationLine: "underline",
  },
  carrotEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  carrotCount: {
    color: "#ec4899",
    fontWeight: "bold",
    letterSpacing: 1,
  },
  logoutBtn: {
    borderWidth: 1,
    borderColor: "#3a3a46",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: "flex-start",
    marginTop: "auto",
  },
})

export default ProfileDrawer
