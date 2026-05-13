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
        <Text variant="textBase" mb="2">{label}</Text>
      ) : null}
      <Box width="100%" bg="dark700" borderRadius="rounded2Xl" px="4" py="4">
        <TextInput
          placeholderTextColor="#aeaeb2"
          style={[styles.input, style]}
          {...rest}
        />
      </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
  input: {
    width: "100%",
    fontSize: 20,
    color: "#ffffff",
  },
})

export default FormInput
