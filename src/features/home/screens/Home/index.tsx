import { Box, Text } from "@/shared/utils/theme"
import { BottomSheetModal } from "@gorhom/bottom-sheet"
import React, { useMemo, useRef, useState } from "react"
import HomeHeader from "../../components/HomeHeader"
import FloatingActionButton from "../../components/FloatingActionButton"
import TaskList from "@/features/tasks/components/TaskList"
import CategoryFilterSheet from "@/features/categories/components/CategoryFilterSheet"
import HomeScreenSkeleton from "@/shared/components/skeletons/HomeScreenSkeleton"
import useHydration from "@/shared/hooks/useHydration"
import CarrotRewardOverlay from "@/shared/components/CarrotRewardOverlay"
import useGlobalStore from "@/store"
import ProgressBar from "../../components/ProgressBar"
import StreakBadge from "../../components/StreakBadge"
import ConfettiOverlay from "../../components/ConfettiOverlay"
import ShellModuleTabs from "../../components/ShellModuleTabs"
import { DrawerActions, useNavigation } from "@react-navigation/native"
import { Pressable, ScrollView, View } from "react-native"
import Animated, { FadeInUp } from "react-native-reanimated"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import BadgesModal from "@/features/badges/components/BadgesModal"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { ShellModule } from "@/store"

const Home = () => {
  const bottomSheetRef = useRef<BottomSheetModal>(null)
  const snapPoints = useMemo(() => ["60%"], [])
  const hasHydrated = useHydration()
  const [showCarrotOverlay, setShowCarrotOverlay] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showBadges, setShowBadges] = useState(false)

  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  const originalToggleTaskStatus = useGlobalStore((s) => s.toggleTaskStatus)
  const activeModule = useGlobalStore((s) => s.activeShellModule)
  const setActiveShellModule = useGlobalStore((s) => s.setActiveShellModule)
  const { categories, badges, carrots, user, themeMode, toggleTheme, logout } = useGlobalStore()

  const toggleTaskStatus = (task: ITask) => {
    if (!task.completed) setShowCarrotOverlay(true)
    originalToggleTaskStatus(task)
  }

  if (!hasHydrated) {
    return <HomeScreenSkeleton />
  }

  const renderTasksModule = () => (
    <Box flex={1}>
      <ProgressBar onAllComplete={() => setShowConfetti(true)} />
      <Box height={8} />
      <TaskList overrideToggle={toggleTaskStatus} />
      <FloatingActionButton />
    </Box>
  )

  const renderCategoriesModule = () => (
    <Box flex={1} px="4">
      <Box mb="3">
        <Text variant="textXl">Categories</Text>
        <Text variant="textBase" color="gray200" mt="1">
          Browse and organize your task groups.
        </Text>
      </Box>

      {categories.length === 0 ? (
        <Box bg="dark800" borderRadius="rounded3Xl" p="4" borderWidth={1} borderColor="separator">
          <Text variant="textLg">No categories yet</Text>
          <Text variant="textBase" color="gray200" mt="1">
            Create one to start organizing your tasks.
          </Text>

          <Pressable
            onPress={() => navigation.navigate("CreateCategory")}
            accessibilityRole="button"
            accessibilityLabel="Create category"
            style={({ pressed }) => [{ opacity: pressed ? 0.88 : 1 }]}
          >
            <Box mt="4" bg="systemBlue" alignItems="center" py="3" borderRadius="rounded2Xl">
              <Text variant="textBase">Create category</Text>
            </Box>
          </Pressable>
        </Box>
      ) : (
        <Box gap="3">
          {categories.map((category) => (
            <Box
              key={category.id}
              bg="dark800"
              borderRadius="rounded3Xl"
              p="4"
              borderWidth={1}
              borderColor="separator"
            >
              <Box flexDirection="row" alignItems="center" justifyContent="space-between">
                <Box flexDirection="row" alignItems="center" flex={1} pr="3">
                  <Box
                    width={14}
                    height={14}
                    borderRadius="roundedFull"
                    style={{ backgroundColor: category.color.code, shadowColor: category.color.code, shadowOpacity: 0.35, shadowRadius: 10, shadowOffset: { width: 0, height: 3 } }}
                  />
                  <Text variant="textLg" ml="3">
                    {category.name}
                  </Text>
                </Box>

                <Pressable
                  onPress={() => navigation.navigate("CreateTask")}
                  accessibilityRole="button"
                  accessibilityLabel={`Create task in ${category.name}`}
                  style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
                >
                  <Box bg="dark700" px="3" py="2" borderRadius="roundedFull">
                    <Text variant="textBase">Add</Text>
                  </Box>
                </Pressable>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )

  const renderRewardsModule = () => (
    <Box flex={1} px="4">
      <Box bg="dark800" borderRadius="rounded3Xl" p="4" borderWidth={1} borderColor="separator" mb="3">
        <Text variant="textXl">Rewards</Text>
        <Text variant="textBase" color="gray200" mt="1">
          Carrots, streaks, and badge progress.
        </Text>

        <Box flexDirection="row" justifyContent="space-between" mt="4">
          <Box>
            <Text variant="textBase" color="gray200">Carrots</Text>
            <Text variant="text2Xl" mt="1">{carrots.toLocaleString()}</Text>
          </Box>
          <Box>
            <Text variant="textBase" color="gray200">Streak</Text>
            <Text variant="text2Xl" mt="1">{useGlobalStore.getState().currentStreak}</Text>
          </Box>
        </Box>

        <Pressable
          onPress={() => setShowBadges(true)}
          accessibilityRole="button"
          accessibilityLabel="View badges"
          style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
        >
          <Box mt="4" bg="systemPink" alignItems="center" py="3" borderRadius="rounded2Xl">
            <Text variant="textBase">View badges</Text>
          </Box>
        </Pressable>
      </Box>

      {badges.map((badge) => (
        <Box
          key={badge.id}
          bg="dark800"
          borderRadius="rounded3Xl"
          p="4"
          borderWidth={1}
          borderColor="separator"
          mb="3"
        >
          <Box flexDirection="row" alignItems="center">
            <Text variant="textXl">{badge.icon}</Text>
            <Box ml="3" flex={1}>
              <Text variant="textLg">{badge.name}</Text>
              <Text variant="textBase" color="gray200" mt="1">
                {badge.description}
              </Text>
            </Box>
            <Text variant="textBase" color={badge.unlocked ? "systemGreen" : "gray200"}>
              {badge.unlocked ? "Unlocked" : "Locked"}
            </Text>
          </Box>
        </Box>
      ))}
    </Box>
  )

  const renderProfileModule = () => (
    <Box flex={1} px="4">
      <Box bg="dark800" borderRadius="rounded3Xl" p="4" borderWidth={1} borderColor="separator" mb="3">
        <Text variant="textXl">Profile</Text>
        <Text variant="textBase" color="gray200" mt="1">
          Signed in as {user?.username ?? "guest"}
        </Text>

        <Box mt="4" flexDirection="row" justifyContent="space-between">
          <Box>
            <Text variant="textBase" color="gray200">Theme</Text>
            <Text variant="textLg" mt="1">{themeMode}</Text>
          </Box>
          <Box>
            <Text variant="textBase" color="gray200">Status</Text>
            <Text variant="textLg" mt="1">Active</Text>
          </Box>
        </Box>

        <Pressable
          onPress={toggleTheme}
          accessibilityRole="button"
          accessibilityLabel="Toggle theme"
          style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
        >
          <Box mt="4" bg="dark700" alignItems="center" py="3" borderRadius="rounded2Xl">
            <Text variant="textBase">Toggle theme</Text>
          </Box>
        </Pressable>

        <Pressable
          onPress={() => {
            logout()
            navigation.dispatch(DrawerActions.closeDrawer())
          }}
          accessibilityRole="button"
          accessibilityLabel="Log out"
          style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
        >
          <Box mt="3" bg="dark700" alignItems="center" py="3" borderRadius="rounded2Xl">
            <Text variant="textBase" color="systemPink">Log out</Text>
          </Box>
        </Pressable>
      </Box>
    </Box>
  )

  const moduleContent: Record<ShellModule, React.ReactNode> = {
    tasks: renderTasksModule(),
    categories: renderCategoriesModule(),
    rewards: renderRewardsModule(),
    profile: renderProfileModule(),
  }

  return (
    <Box flex={1} bg="dark900">
      <HomeHeader bottomSheetRef={bottomSheetRef} />
      <Box px="4" mt="2">
        <StreakBadge />
        <ShellModuleTabs activeModule={activeModule} onChange={setActiveShellModule} />
      </Box>

      <Animated.View key={activeModule} entering={FadeInUp.duration(240)} style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
          showsVerticalScrollIndicator={false}
        >
          {moduleContent[activeModule]}
        </ScrollView>
      </Animated.View>

      <BottomSheetModal
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: "#1e1e21" }}
        handleIndicatorStyle={{ backgroundColor: "#6b7280" }}
      >
        <CategoryFilterSheet bottomSheetRef={bottomSheetRef} />
      </BottomSheetModal>

      <CarrotRewardOverlay
        visible={showCarrotOverlay}
        onHide={() => setShowCarrotOverlay(false)}
      />

      <ConfettiOverlay
        visible={showConfetti}
        onDone={() => setShowConfetti(false)}
      />

      <BadgesModal visible={showBadges} onClose={() => setShowBadges(false)} />
    </Box>
  )
}

export default Home
