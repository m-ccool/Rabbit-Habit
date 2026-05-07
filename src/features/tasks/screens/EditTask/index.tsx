import { RootStackParamList } from "@/navigation/types"
import useGlobalStore from "@/store"
import { Box, Text } from "@/shared/utils/theme"
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import React, { useState } from "react"
import { Pressable, ScrollView, StyleSheet, TextInput } from "react-native"
import FormInput from "@/shared/components/FormInput"
import CategoryPickerField from "../../components/CategoryPickerField"
import { getColors } from "@/shared/utils/helpers"
import { nanoid } from "nanoid/non-secure"

const COLORS = getColors()
const DAYS = ["S", "M", "T", "W", "T", "F", "S"]

type EditTaskRoute = RouteProp<RootStackParamList, "EditTask">

const EditTask = () => {
  const { categories, updateTasks, tasks } = useGlobalStore()
  const navigation = useNavigation()
  const { params } = useRoute<EditTaskRoute>()

  const [editedTask, setEditedTask] = useState<ITask>(params.task)
  const [subTaskInput, setSubTaskInput] = useState("")

  const handleSaveTask = () => {
    const updatedTasks = tasks.map((t) =>
      t.id === editedTask.id ? { ...editedTask } : t
    )
    updateTasks(updatedTasks)
    navigation.navigate("Home")
  }

  const handleDeleteTask = () => {
    const updatedTasks = tasks.filter((t) => t.id !== editedTask.id)
    updateTasks(updatedTasks)
    navigation.navigate("Home")
  }

  const toggleDay = (dayIndex: number) => {
    const current = editedTask.repeatDays ?? []
    const updated = current.includes(dayIndex)
      ? current.filter((d) => d !== dayIndex)
      : [...current, dayIndex]
    setEditedTask((prev) => ({ ...prev, repeatDays: updated }))
  }

  const addSubTask = () => {
    if (!subTaskInput.trim()) return
    const sub: ISubTask = { id: `sub_${nanoid()}`, name: subTaskInput.trim(), completed: false }
    setEditedTask((prev) => ({ ...prev, subTasks: [...(prev.subTasks ?? []), sub] }))
    setSubTaskInput("")
  }

  const toggleSubTask = (subId: string) => {
    setEditedTask((prev) => ({
      ...prev,
      subTasks: (prev.subTasks ?? []).map((s) =>
        s.id === subId ? { ...s, completed: !s.completed } : s
      ),
    }))
  }

  return (
    <Box flex={1} bg="dark900">
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Task name */}
        <Text variant="textBase" color="gray200" mb="2">task name</Text>
        <FormInput
          placeholder="Task name"
          value={editedTask.name}
          onChangeText={(text) => setEditedTask((prev) => ({ ...prev, name: text }))}
        />

        {/* Category */}
        <Box mt="5">
          <CategoryPickerField
            categories={categories}
            selectedCategoryId={editedTask.category_id}
            onValueChange={(id) => setEditedTask((prev) => ({ ...prev, category_id: id }))}
          />
        </Box>

        {/* Repeat days */}
        <Text variant="textBase" color="gray200" mt="5" mb="2">repeat</Text>
        <Box flexDirection="row" justifyContent="space-between">
          {DAYS.map((day, i) => {
            const selected = editedTask.repeatDays?.includes(i)
            return (
              <Pressable
                key={i}
                onPress={() => toggleDay(i)}
                style={[styles.dayCircle, selected ? styles.daySelected : styles.dayUnselected]}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: selected }}
              >
                <Text style={[styles.dayText, selected ? styles.dayTextSelected : undefined]}>
                  {day}
                </Text>
              </Pressable>
            )
          })}
        </Box>

        {/* Task color */}
        <Text variant="textBase" color="gray200" mt="5" mb="2">task color</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {COLORS.filter((c) => !c.name.startsWith("dark") && !c.name.startsWith("gray") && !c.name.startsWith("white")).map((color) => (
            <Pressable
              key={color.id}
              onPress={() => setEditedTask((prev) => ({ ...prev, color }))}
              style={[
                styles.colorCircle,
                { backgroundColor: color.code },
                editedTask.color?.id === color.id && styles.colorSelected,
              ]}
              accessibilityRole="radio"
              accessibilityState={{ selected: editedTask.color?.id === color.id }}
            />
          ))}
        </ScrollView>

        {/* Sub tasks */}
        <Text variant="textBase" color="gray200" mt="5" mb="2">sub tasks</Text>
        {(editedTask.subTasks ?? []).map((sub) => (
          <Pressable
            key={sub.id}
            onPress={() => toggleSubTask(sub.id)}
            style={styles.subTaskRow}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: sub.completed }}
          >
            <Text style={styles.subCheck}>{sub.completed ? "☑" : "☐"}</Text>
            <Text
              variant="textBase"
              color="gray200"
              style={sub.completed ? styles.completedText : undefined}
            >
              {sub.name}
            </Text>
          </Pressable>
        ))}
        <Box flexDirection="row" alignItems="center" mt="2">
          <Box flex={1} bg="dark700" borderRadius="rounded2Xl" px="4" py="3">
            <TextInput
              style={styles.subInput}
              placeholder="add sub task..."
              placeholderTextColor="#6b7280"
              value={subTaskInput}
              onChangeText={setSubTaskInput}
              onSubmitEditing={addSubTask}
              returnKeyType="done"
            />
          </Box>
        </Box>
      </ScrollView>

      {/* Action buttons */}
      <Box px="4" pb="8" flexDirection="row">
        <Pressable
          onPress={handleDeleteTask}
          style={[styles.actionBtn, styles.deleteBtn, { marginRight: 12 }]}
          accessibilityRole="button"
          accessibilityLabel="Delete task"
        >
          <Text variant="textBase" style={styles.deleteBtnText}>delete</Text>
        </Pressable>
        <Pressable
          onPress={handleSaveTask}
          style={[styles.actionBtn, styles.saveBtn]}
          accessibilityRole="button"
          accessibilityLabel="Save task"
        >
          <Text variant="textBase" style={styles.saveBtnText}>save</Text>
        </Pressable>
      </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
  scroll: {
    padding: 16,
    paddingBottom: 8,
  },
  dayCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  dayUnselected: {
    borderColor: "#3a3a46",
    backgroundColor: "transparent",
  },
  daySelected: {
    borderColor: "#ec4899",
    backgroundColor: "#ec489933",
  },
  dayText: {
    color: "#9ca3af",
    fontWeight: "bold",
    fontSize: 14,
  },
  dayTextSelected: {
    color: "#ec4899",
  },
  colorCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginRight: 10,
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: "#ffffff",
  },
  subTaskRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  subCheck: {
    fontSize: 20,
    color: "#9ca3af",
    marginRight: 10,
  },
  completedText: {
    textDecorationLine: "line-through",
    opacity: 0.5,
  },
  subInput: {
    fontSize: 16,
    color: "#ffffff",
    width: "100%",
  },
  actionBtn: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
  },
  deleteBtn: {
    borderColor: "#ef4444",
    backgroundColor: "transparent",
  },
  deleteBtnText: {
    color: "#ef4444",
    fontWeight: "bold",
  },
  saveBtn: {
    borderColor: "#3b82f6",
    backgroundColor: "transparent",
  },
  saveBtnText: {
    color: "#3b82f6",
    fontWeight: "bold",
  },
})

export default EditTask
