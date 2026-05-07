import useGlobalStore from "@/store"
import React, { useState } from "react"
import { Pressable, StyleSheet, TextInput, View, Text as RNText } from "react-native"

const Login = () => {
  const { login } = useGlobalStore()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) return
    login(email.trim())
  }

  return (
    <View style={styles.root}>
      {/* Logo + title */}
      <View style={styles.header}>
        <RNText style={styles.mascots}>🥕 🐇</RNText>
        <RNText style={styles.title}>RABBIT HABIT</RNText>
        <RNText style={styles.subtitle}>habit tracker</RNText>
      </View>

      {/* Community stat */}
      <RNText style={styles.carrots}>34,234 CARROTS GROWN</RNText>

      {/* Form */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="email@test.com"
          placeholderTextColor="#636366"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          autoComplete="email"
        />
        <TextInput
          style={styles.input}
          placeholder="password"
          placeholderTextColor="#636366"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          textContentType="password"
          autoComplete="password"
        />

        <Pressable
          onPress={handleLogin}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          accessibilityRole="button"
        >
          <RNText style={styles.buttonText}>log in</RNText>
        </Pressable>
      </View>

      {/* Footer */}
      <RNText style={styles.github}>⬡  github</RNText>
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
  header: {
    alignItems: "center",
    marginBottom: 12,
  },
  mascots: {
    fontSize: 52,
    marginBottom: 16,
  },
  title: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: 3,
    marginBottom: 4,
  },
  subtitle: {
    color: "#8E8E93",
    fontSize: 14,
    letterSpacing: 0.5,
  },
  carrots: {
    color: "#FF375F",
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 1.5,
    marginBottom: 36,
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  input: {
    backgroundColor: "#1C1C1E",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    fontSize: 17,
    color: "#ffffff",
    width: "100%",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#1C1C1E",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#3A3A3C",
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "600",
  },
  github: {
    color: "#636366",
    fontSize: 16,
    marginTop: 40,
  },
})

export default Login
