import Navigation from "@/navigation"
import theme from "@/utils/theme"
import ErrorBoundary from "@/shared/components/ErrorBoundary"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { NavigationContainer } from "@react-navigation/native"
import { ThemeProvider } from "@shopify/restyle"
import "react-native-gesture-handler"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { SafeAreaProvider } from "react-native-safe-area-context"

export default function App() {
  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
      }}
    >
      <ThemeProvider theme={theme}>
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
