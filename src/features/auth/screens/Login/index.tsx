import FormInput from "@/shared/components/FormInput"
import useHydration from "@/shared/hooks/useHydration"
import useGlobalStore from "@/store"
import { Box, Text } from "@/shared/utils/theme"
import React, { useMemo, useState } from "react"
import { Modal, TouchableOpacity } from "react-native"

type AuthMode = "login" | "create"

const DEV_EMAIL = "test@test.com"
const DEV_PASSWORD = "test"

export default function Login() {
  const { login, registerUser } = useGlobalStore()
  const hasHydrated = useHydration()
  const [mode, setMode] = useState<AuthMode>("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")

  const actionLabel = useMemo(
    () => (mode === "login" ? "Log In" : "Create Account"),
    [mode]
  )

  const validate = () => {
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.")
      return false
    }

    if (mode === "create" && password !== confirmPassword) {
      setError("Passwords do not match.")
      return false
    }

    return true
  }

  const handleSubmit = () => {
    setError("")
    if (!validate()) return

    const normalizedEmail = email.trim().toLowerCase()

    if (mode === "create") {
      const created = registerUser(normalizedEmail, password)
      if (!created) {
        setError("An account with that email already exists.")
        return
      }
    }

    const signedIn = login(normalizedEmail, password)
    if (!signedIn) {
      setError(
        __DEV__
          ? "Use test@test.com / test or create a local account first."
          : "Invalid credentials."
      )
      return
    }
  }

  if (!hasHydrated) {
    return <Box flex={1} bg="dark900" />
  }

  return (
    <Box flex={1} bg="dark900" justifyContent="center" px="5">
      <Modal transparent visible animationType="fade" statusBarTranslucent>
        <Box
          flex={1}
          justifyContent="center"
          alignItems="center"
          px="4"
          bg="dark900"
        >
          <Box width="100%" maxWidth={420} bg="dark800" borderRadius="rounded4Xl" p="5">
            <Box alignItems="center" mb="4">
              <Text variant="text4Xl">🥕 🐇</Text>
              <Text variant="text2Xl" mt="2">
                Rabbit Habit
              </Text>
              <Text variant="textBase" color="gray200" mt="2" textAlign="center">
                {mode === "login"
                  ? "Welcome back. Sign in to continue."
                  : "Create an account to enter the app."}
              </Text>
            </Box>

            <Box gap="3">
              <FormInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="email@test.com"
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
                autoComplete="email"
              />

              <FormInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="password"
                secureTextEntry
                textContentType="password"
                autoComplete="password"
              />

              {mode === "create" ? (
                <FormInput
                  label="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="confirm password"
                  secureTextEntry
                  textContentType="password"
                  autoComplete="password"
                />
              ) : null}
            </Box>

            {error ? (
              <Text variant="textBase" color="systemRed" mt="3">
                {error}
              </Text>
            ) : null}

            <TouchableOpacity
              onPress={handleSubmit}
              accessibilityRole="button"
              accessibilityLabel={actionLabel}
              activeOpacity={0.85}
            >
              <Box
                mt="4"
                py="4"
                borderRadius="rounded2Xl"
                bg="systemPink"
                alignItems="center"
                justifyContent="center"
              >
                <Text variant="textLg">{actionLabel}</Text>
              </Box>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setMode(mode === "login" ? "create" : "login")
                setError("")
                setPassword("")
                setConfirmPassword("")
              }}
              accessibilityRole="button"
              accessibilityLabel={
                mode === "login" ? "Switch to create account" : "Switch to login"
              }
              activeOpacity={0.75}
            >
              <Box mt="3" alignItems="center">
                <Text variant="textBase" color="gray200">
                  {mode === "login"
                    ? "Need an account? Create one"
                    : "Already have an account? Log in"}
                </Text>
              </Box>
            </TouchableOpacity>

            {__DEV__ ? (
              <Box mt="4" p="3" borderRadius="roundedXl" bg="dark700">
                <Text variant="textBase" color="gray200" textAlign="center">
                  Dev mode enabled: use test@test.com / test to log in instantly.
                </Text>
              </Box>
            ) : null}
          </Box>
        </Box>
      </Modal>
    </Box>
  )
}
