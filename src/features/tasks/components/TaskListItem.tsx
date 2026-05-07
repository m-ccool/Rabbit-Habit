import { Box, Text, Theme } from "@/shared/utils/theme"
import { useTheme } from "@shopify/restyle"
import React from "react"
import { Pressable, StyleSheet, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
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

  const subTasks = task.subTasks ?? []
  const completedSubs = subTasks.filter((s) => s.completed).length
  const subProgress = subTasks.length > 0 ? completedSubs / subTasks.length : 0

  return (
    <Pressable
      onLongPress={() => navigation.navigate("EditTask", { task })}
      accessibilityRole="none"
      style={styles.card}
    >
      <View style={[styles.cardInner, { backgroundColor: theme.colors.dark800 }]}>
        {/* Colored left accent bar */}
        <View style={[styles.accentBar, { backgroundColor: accentColor }]} />

        <View style={styles.content}>
          {/* Main task row */}
          <Pressable
            onPress={handleToggle}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: task.completed }}
            accessibilityLabel={task.name}
            style={styles.mainRow}
          >
            <Ionicons
              name={task.completed ? "checkmark-circle" : "ellipse-outline"}
              size={26}
              color={task.completed ? theme.colors.systemGreen : theme.colors.gray200}
            />
            <Text
              variant="textLg"
              ml="3"
              style={[
                styles.taskName,
                task.completed && styles.completedText,
              ]}
            >
              {task.name}
            </Text>
          </Pressable>

          {/* Sub-task progress bar */}
          {subTasks.length > 0 && (
            <View style={styles.progressSection}>
              <View style={[styles.progressTrack, { backgroundColor: theme.colors.dark600 }]}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${subProgress * 100}%` as any, backgroundColor: accentColor },
                  ]}
                />
              </View>
            </View>
          )}

          {/* Sub-tasks */}
          {subTasks.length > 0 && (
            <View style={styles.subTaskList}>
              {subTasks.map((sub) => (
                <Pressable
                  key={sub.id}
                  onPress={() => toggleSubTaskStatus(task.id, sub.id)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: sub.completed }}
                  accessibilityLabel={sub.name}
                  style={styles.subTaskRow}
                >
                  <Ionicons
                    name={sub.completed ? "checkbox" : "square-outline"}
                    size={18}
                    color={sub.completed ? theme.colors.systemGreen : theme.colors.gray200}
                  />
                  <Text
                    variant="textBase"
                    ml="2"
                    color="gray200"
                    style={sub.completed ? styles.completedText : undefined}
                  >
                    {sub.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 5,
  },
  cardInner: {
    flexDirection: "row",
    borderRadius: 14,
    overflow: "hidden",
  },
  accentBar: {
    width: 4,
  },
  content: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  mainRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  taskName: {
    flex: 1,
    fontWeight: "500",
  },
  completedText: {
    textDecorationLine: "line-through",
    opacity: 0.45,
  },
  progressSection: {
    marginTop: 10,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  subTaskList: {
    marginTop: 10,
  },
  subTaskRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
})

export default TaskListItem
