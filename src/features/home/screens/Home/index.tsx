import { Box } from "@/shared/utils/theme"
import { BottomSheetModal } from "@gorhom/bottom-sheet"
import React, { useMemo, useRef } from "react"
import HomeHeader from "../../components/HomeHeader"
import FloatingActionButton from "../../components/FloatingActionButton"
import TaskList from "@/features/tasks/components/TaskList"
import CategoryFilterSheet from "@/features/categories/components/CategoryFilterSheet"
import HomeScreenSkeleton from "@/shared/components/skeletons/HomeScreenSkeleton"
import useHydration from "@/shared/hooks/useHydration"

const Home = () => {
  const bottomSheetRef = useRef<BottomSheetModal>(null)
  const snapPoints = useMemo(() => ["60%"], [])
  const hasHydrated = useHydration()

  if (!hasHydrated) {
    return <HomeScreenSkeleton />
  }

  return (
    <Box flex={1} bg="gray100">
      <HomeHeader bottomSheetRef={bottomSheetRef} />

      <Box height={20} />
      <TaskList />

      <BottomSheetModal ref={bottomSheetRef} index={0} snapPoints={snapPoints}>
        <CategoryFilterSheet bottomSheetRef={bottomSheetRef} />
      </BottomSheetModal>

      <FloatingActionButton />
    </Box>
  )
}

export default Home
