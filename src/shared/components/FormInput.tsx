import React from "react"
import { StyleSheet, TextInput, TextInputProps } from "react-native"
import { Box, Text } from "@/shared/utils/theme"

interface FormInputProps extends TextInputProps {
  label?: string
}

/**
 * Shared styled text input used across create/edit screens.
 */
const FormInput = ({ label, style, ...rest }: FormInputProps) => {
  return (
    <Box width="100%">
      {label ? (
        <Text variant="textBase" mb="2" color="white">
          {label}
        </Text>
      ) : null}
      <Box
        width="100%"
        bg="dark700"
        borderRadius="rounded2Xl"
        alignItems="center"
        justifyContent="center"
        p="4"
      >
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor="#6b7280"
          {...rest}
        />
      </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
  input: {
    fontSize: 20,
    width: "100%",
    color: "#ffffff",
  },
})

export default FormInput
