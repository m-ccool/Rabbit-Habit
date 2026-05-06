import { Box, Text } from "@/shared/utils/theme"
import React from "react"
import { MaterialCommunityIcons } from "@expo/vector-icons"

/**
 * Shown when a category has no tasks yet.
 */
const TaskListEmpty = () => {
  return (
    <Box flex={1} alignItems="center" justifyContent="center" mt="10">
      <MaterialCommunityIcons name="checkbox-blank-outline" size={64} color="#3a3a46" />
      <Text variant="text2Xl" mt="4" color="gray200">
        No tasks yet
      </Text>
      <Text variant="textBase" mt="2" color="gray200">
        Tap + to add your first task
      </Text>
    </Box>
  )
}

export default TaskListEmpty
