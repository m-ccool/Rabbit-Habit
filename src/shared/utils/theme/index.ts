import { createBox, createText, createTheme } from "@shopify/restyle"
import { colors, palette } from "./colors"
import { textVariants } from "./text-variants"

const baseTheme = {
  breakpoints: {},
  textVariants: textVariants,
  spacing: {
    "1": 4,
    "2": 8,
    "3": 12,
    "4": 16,
    "5": 20,
    "6": 24,
    "7": 28,
    "8": 32,
    "9": 36,
    "10": 40,
  },
  borderRadii: {
    rounded:     6,
    roundedXl:  10,
    rounded2Xl: 14,
    rounded3Xl: 20,
    rounded4Xl: 28,
    roundedFull: 9999,
  },
}

export const darkTheme = createTheme({
  ...baseTheme,
  colors: {
    ...colors,
    foreground: palette.foreground,
  },
})

export const COLORS = {
  ...colors,
  card: colors.dark800,
  muted: colors.dark700,
  border: colors.separator,
}

export const lightTheme = createTheme({
  ...baseTheme,
  colors: {
    ...colors,
    dark900: palette.light900,
    dark800: palette.light800,
    dark700: palette.light700,
    dark600: palette.light600,
    gray200: "#6b7280",
    separator: "#d1d5db",
    foreground: palette.foregroundLight,
  },
})

// Default export keeps backward compat (used in App.tsx before theme switching was wired)
const theme = darkTheme
export type Theme = typeof darkTheme

export const Box = createBox<Theme>()
export const Text = createText<Theme>()

export default theme
