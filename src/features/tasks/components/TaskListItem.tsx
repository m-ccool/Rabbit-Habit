import { Box, Text, Theme } from "@/shared/utils/theme"
import { useTheme } from "@shopify/restyle"
import React from "react"
import { Pressable, StyleSheet } from "react-native"
import { FontAwesome } from "@expo/vector-icons"
import useGlobalStore from "@/store"
import { useNavigation } from "@react-navigation/native"

type TaskListItemProps = {
  task: ITask
  overrideToggle?: (task: ITask) => void
}

const TaskListItem = ({ task, overrideToggle }: TaskListItemProps) => {
  const theme = useTheme<Theme>()
  const navigation = useNavigation()
  const { toggleTaskStatus, toggleSubTaskStatus } = useGlobalStore()
  const accentColor = task.color?.code ?? theme.colors.dark600

  const handleToggle = () => {
    if (overrideToggle) {
      overrideToggle(task)
    } else {
      toggleTaskStatus(task)
    }
  }

  return (
    <Box
      bg="dark800"
      borderRadius="rounded2Xl"
      flex={1}
      my="2"
      mx="2"
      style={{ borderLeftWidth: 4, borderLeftColor: accentColor }}
    >
      <Box p="4">
        <Pressable
          onPress={handleToggle}
          onLongPress={() => navigation.navigate("EditTask", { task })}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: task.completed }}
          accessibilityLabel={task.name}
        >
          <Box flexDirection="row" alignItems="center">
            <FontAwesome
              name="square"
              size={24}
              color={task.completed ? theme.colors.green500 : theme.colors.gray200}
            />
            <Text
              variant="textXl"
              ml="4"
              style={task.completed ? styles.completedText : undefined}
            >
              {task.name}
            </Text>
          </Box>
        </Pressable>

        {/* Sub-tasks */}
        {task.subTasks && task.subTasks.length > 0 && (
          <Box mt="3" ml="4">
            {task.subTasks.map((sub) => (
              <Pressable
                key={sub.id}
                onPress={() => toggleSubTaskStatus(task.id, sub.id)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: sub.completed }}
                accessibilityLabel={sub.name}
                style={styles.subTaskRow}
              >
                <FontAwesome
                  name={sub.completed ? "check-square-o" : "square-o"}
                  size={18}
                  color={sub.completed ? theme.colors.green400 : theme.colors.gray200}
                />
                <Text
                  variant="textBase"
                  ml="3"
                  color="gray200"
                  style={sub.completed ? styles.completedText : undefined}
                >
                  {sub.name}
                </Text>
              </Pressable>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
  completedText: {
    textDecorationLine: "line-through",
    opacity: 0.5,
  },
  subTaskRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
})

export default TaskListItem
