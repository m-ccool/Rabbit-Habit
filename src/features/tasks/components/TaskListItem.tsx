import { Box, Text, Theme } from "@/shared/utils/theme"
import { useTheme } from "@shopify/restyle"
import React from "react"
import { Pressable } from "react-native"
import { FontAwesome } from "@expo/vector-icons"
import useGlobalStore from "@/store"
import { useNavigation } from "@react-navigation/native"

type TaskListItemProps = {
  task: ITask
}

/**
 * A single task row. Tap to toggle completion, long-press to edit.
 */
const TaskListItem = ({ task }: TaskListItemProps) => {
  const theme = useTheme<Theme>()
  const navigation = useNavigation()
  const { toggleTaskStatus } = useGlobalStore()

  return (
    <Box bg="white" borderRadius="rounded2Xl" flex={1} my="2" mx="2">
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        p="4"
      >
        <Pressable
          onPress={() => toggleTaskStatus(task)}
          onLongPress={() => navigation.navigate("EditTask", { task })}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: task.completed }}
          accessibilityLabel={task.name}
        >
          <Box
            alignItems="center"
            flexDirection="row"
            justifyContent="space-between"
          >
            <FontAwesome
              name="square"
              size={24}
              color={
                task.completed ? theme.colors.green500 : theme.colors.gray200
              }
            />
            <Text variant="textXl" ml="4">
              {task.name}
            </Text>
          </Box>
        </Pressable>
      </Box>
    </Box>
  )
}

export default TaskListItem
