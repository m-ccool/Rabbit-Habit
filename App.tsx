import Navigation from "@/navigation"
import { darkTheme, lightTheme } from "@/shared/utils/theme"
import ErrorBoundary from "@/shared/components/ErrorBoundary"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { NavigationContainer } from "@react-navigation/native"
import { ThemeProvider } from "@shopify/restyle"
import "react-native-gesture-handler"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { SafeAreaProvider } from "react-native-safe-area-context"
import useGlobalStore from "@/store"
import React, { useEffect } from "react"

export default function App() {
  const { generateRecurringTasks, _hasHydrated, themeMode } = useGlobalStore()

  useEffect(() => {
    if (_hasHydrated) {
      generateRecurringTasks()
    }
  }, [_hasHydrated])

  const activeTheme = themeMode === "light" ? lightTheme : darkTheme

  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
      }}
    >
      <ThemeProvider theme={activeTheme}>
        <SafeAreaProvider>
          <ErrorBoundary>
            <BottomSheetModalProvider>
              <NavigationContainer>
                <Navigation />
              </NavigationContainer>
            </BottomSheetModalProvider>
          </ErrorBoundary>
        </SafeAreaProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  )
}
