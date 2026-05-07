import useGlobalStore from "@/store"
import { Box, Text } from "@/shared/utils/theme"
import { useNavigation } from "@react-navigation/native"
import React, { useState } from "react"
import { Pressable, StyleSheet, TextInput } from "react-native"

const Login = () => {
  const { login } = useGlobalStore()
  const navigation = useNavigation()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) return
    login(email.trim())
  }

  return (
    <Box flex={1} bg="dark900" alignItems="center" justifyContent="center" px="6">
      {/* Title */}
      <Text variant="text4Xl" style={styles.title}>
        RABBIT HABIT
      </Text>
      <Text variant="textBase" color="gray200" style={{ marginBottom: 8 }}>
        habit tracker
      </Text>

      {/* Mascots */}
      <Text style={styles.mascots}>🥕 🐇</Text>

      {/* Community stat */}
      <Text variant="textLg" style={styles.carrots}>
        34,234 CARROTS GROWN
      </Text>

      {/* Email input */}
      <Box width="100%" bg="dark700" borderRadius="rounded3Xl" mb="4" px="4" py="3">
        <TextInput
          style={styles.input}
          placeholder="email@test.com"
          placeholderTextColor="#6b7280"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          autoComplete="email"
        />
      </Box>

      {/* Password input */}
      <Box width="100%" bg="dark700" borderRadius="rounded3Xl" mb="6" px="4" py="3">
        <TextInput
          style={styles.input}
          placeholder="password"
          placeholderTextColor="#6b7280"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          textContentType="password"
          autoComplete="password"
        />
      </Box>

      {/* Login button */}
      <Pressable onPress={handleLogin} style={styles.button} accessibilityRole="button">
        <Text variant="textXl" style={styles.buttonText}>
          log in
        </Text>
      </Pressable>

      {/* GitHub link icon */}
      <Text style={styles.github}>⬡</Text>
    </Box>
  )
}

const styles = StyleSheet.create({
  title: {
    color: "#ffffff",
    fontWeight: "bold",
    letterSpacing: 2,
    marginBottom: 4,
  },
  mascots: {
    fontSize: 56,
    marginVertical: 20,
  },
  carrots: {
    color: "#ec4899",
    fontWeight: "bold",
    marginBottom: 32,
    letterSpacing: 1,
  },
  input: {
    fontSize: 18,
    color: "#ffffff",
    width: "100%",
  },
  button: {
    width: "100%",
    backgroundColor: "#1e1e21",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3a3a46",
  },
  buttonText: {
    color: "#ffffff",
  },
  github: {
    fontSize: 28,
    color: "#6b7280",
    marginTop: 32,
  },
})

export default Login
