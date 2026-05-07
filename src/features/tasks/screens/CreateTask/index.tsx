import useGlobalStore from "@/store"
import { Box, Text } from "@/shared/utils/theme"
import { useNavigation } from "@react-navigation/native"
import { nanoid } from "nanoid/non-secure"
import React, { useState } from "react"
import { Pressable, ScrollView, StyleSheet, TextInput, Animated } from "react-native"
import FormInput from "@/shared/components/FormInput"
import CategoryPickerField from "../../components/CategoryPickerField"
import { getColors } from "@/shared/utils/helpers"

const COLORS = getColors()
const DAYS = ["S", "M", "T", "W", "T", "F", "S"]

const CreateTask = () => {
  const { categories, selectedCategory, addTask } = useGlobalStore()
  const navigation = useNavigation()
  const [showToast, setShowToast] = useState(false)

  const [newTask, setNewTask] = useState<ITask>({
    id: `task_${nanoid()}`,
    name: "",
    category_id: selectedCategory?.id ?? "",
    completed: false,
    color: undefined,
    repeatDays: [],
    subTasks: [],
  })
  const [subTaskInput, setSubTaskInput] = useState("")

  const handleCreateTask = () => {
    if (!newTask.name.trim()) return
    addTask(newTask)
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
      navigation.navigate("Home")
    }, 1200)
  }

  const toggleDay = (dayIndex: number) => {
    const current = newTask.repeatDays ?? []
    const updated = current.includes(dayIndex)
      ? current.filter((d) => d !== dayIndex)
      : [...current, dayIndex]
    setNewTask((prev) => ({ ...prev, repeatDays: updated }))
  }

  const addSubTask = () => {
    if (!subTaskInput.trim()) return
    const sub: ISubTask = { id: `sub_${nanoid()}`, name: subTaskInput.trim(), completed: false }
    setNewTask((prev) => ({ ...prev, subTasks: [...(prev.subTasks ?? []), sub] }))
    setSubTaskInput("")
  }

  return (
    <Box flex={1} bg="dark900">
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Task name */}
        <Text variant="textBase" color="gray200" mb="2">task name</Text>
        <FormInput
          placeholder="example - drink water!"
          value={newTask.name}
          onChangeText={(text) => setNewTask((prev) => ({ ...prev, name: text }))}
        />

        {/* Category */}
        <Box mt="5">
          <CategoryPickerField
            categories={categories}
            selectedCategoryId={newTask.category_id}
            onValueChange={(id) => setNewTask((prev) => ({ ...prev, category_id: id }))}
          />
        </Box>

        {/* Repeat days */}
        <Text variant="textBase" color="gray200" mt="5" mb="2">repeat</Text>
        <Box flexDirection="row" justifyContent="space-between">
          {DAYS.map((day, i) => {
            const selected = newTask.repeatDays?.includes(i)
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
              onPress={() => setNewTask((prev) => ({ ...prev, color }))}
              style={[
                styles.colorCircle,
                { backgroundColor: color.code },
                newTask.color?.id === color.id && styles.colorSelected,
              ]}
              accessibilityRole="radio"
              accessibilityState={{ selected: newTask.color?.id === color.id }}
            />
          ))}
        </ScrollView>

        {/* Sub tasks */}
        <Text variant="textBase" color="gray200" mt="5" mb="2">add sub task</Text>
        {(newTask.subTasks ?? []).map((sub, i) => (
          <Text key={sub.id} variant="textBase" color="gray200" mb="1">
            {i + 1} {sub.name}
          </Text>
        ))}
        <Box flexDirection="row" alignItems="center" mt="2">
          <Box flex={1} bg="dark700" borderRadius="rounded2Xl" px="4" py="3">
            <TextInput
              style={styles.subInput}
              placeholder={`${(newTask.subTasks?.length ?? 0) + 1} thermoflask of water`}
              placeholderTextColor="#6b7280"
              value={subTaskInput}
              onChangeText={setSubTaskInput}
              onSubmitEditing={addSubTask}
              returnKeyType="done"
            />
          </Box>
        </Box>
      </ScrollView>

      {/* Create button */}
      <Box px="4" pb="8">
        <Pressable
          onPress={handleCreateTask}
          style={styles.createBtn}
          accessibilityRole="button"
          accessibilityLabel="Create task"
        >
          <Text variant="textXl" style={styles.createBtnText}>
            {showToast ? "task added !" : "create task"}
          </Text>
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
  subInput: {
    fontSize: 16,
    color: "#ffffff",
    width: "100%",
  },
  createBtn: {
    backgroundColor: "#1e1e21",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ec4899",
  },
  createBtnText: {
    color: "#ec4899",
    fontWeight: "bold",
  },
})

export default CreateTask
