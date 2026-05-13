import React from "react"
import { StyleSheet, View } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { COLORS } from "@/shared/utils/theme"
import { Text } from "@/shared/utils/theme"

const TaskListEmpty = () => {
  return (
    <View style={styles.root}>
      <MaterialCommunityIcons name="checkbox-blank-outline" size={64} color={COLORS.border} />
      <Text variant="text2Xl" color="gray200" mt="4">No tasks yet</Text>
      <Text variant="textBase" color="gray200" mt="2">Tap + to add your first task</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
})

export default TaskListEmpty
