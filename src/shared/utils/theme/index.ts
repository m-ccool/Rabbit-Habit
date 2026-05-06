import { createBox, createText, createTheme } from "@shopify/restyle"
import { colors } from "./colors"
import { textVariants } from "./text-variants"

export const theme = createTheme({
  breakpoints: {},
  colors: colors,
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
    rounded: 4,
    roundedXl: 8,
    rounded2Xl: 16,
    rounded3Xl: 24,
    rounded4Xl: 32,
    roundedFull: 9999,
  },
})

export type Theme = typeof theme

export const Box = createBox<Theme>()
export const Text = createText<Theme>()

export default theme
