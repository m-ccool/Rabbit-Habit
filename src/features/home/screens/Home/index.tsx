import { Box } from "@/shared/utils/theme"
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

const Home = () => {
  const bottomSheetRef = useRef<BottomSheetModal>(null)
  const snapPoints = useMemo(() => ["60%"], [])
  const hasHydrated = useHydration()
  const [showCarrotOverlay, setShowCarrotOverlay] = useState(false)

  const originalToggleTaskStatus = useGlobalStore((s) => s.toggleTaskStatus)
  const toggleTaskStatus = (task: ITask) => {
    if (!task.completed) setShowCarrotOverlay(true)
    originalToggleTaskStatus(task)
  }

  if (!hasHydrated) {
    return <HomeScreenSkeleton />
  }

  return (
    <Box flex={1} bg="dark900">
      <HomeHeader bottomSheetRef={bottomSheetRef} />

      <Box height={20} />
      <TaskList overrideToggle={toggleTaskStatus} />

      <BottomSheetModal
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: "#1e1e21" }}
        handleIndicatorStyle={{ backgroundColor: "#6b7280" }}
      >
        <CategoryFilterSheet bottomSheetRef={bottomSheetRef} />
      </BottomSheetModal>

      <FloatingActionButton />

      <CarrotRewardOverlay
        visible={showCarrotOverlay}
        onHide={() => setShowCarrotOverlay(false)}
      />
    </Box>
  )
}

export default Home
