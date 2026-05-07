import useGlobalStore from "@/store"
import { Box, Text } from "@/shared/utils/theme"
import { useNavigation } from "@react-navigation/native"
import { nanoid } from "nanoid/non-secure"
import React, { useState } from "react"
import { Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native"
import CategoryPickerField from "../../components/CategoryPickerField"

// iOS-system color swatches matching the wireframe
const TASK_COLORS: IColor[] = [
  { id: "c_pink",   code: "#FF375F", name: "systemPink" },
  { id: "c_green",  code: "#30D158", name: "systemGreen" },
  { id: "c_teal",   code: "#5AC8FA", name: "systemTeal" },
  { id: "c_blue",   code: "#0A84FF", name: "systemBlue" },
  { id: "c_purple", code: "#BF5AF2", name: "systemPurple" },
  { id: "c_orange", code: "#FF9500", name: "systemOrange" },
  { id: "c_yellow", code: "#FFD60A", name: "systemYellow" },
]

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
    <View style={styles.root}>
      {/* Nav header */}
      <View style={styles.navBar}>
        <Text variant="textLg" style={styles.navTitle}>create a task</Text>
        <Text style={styles.carrotIcon}>🥕</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Task name */}
        <Text variant="textBase" style={styles.label}>task name</Text>
        <TextInput
          style={styles.input}
          placeholder="example - drink water!"
          placeholderTextColor="#636366"
          value={newTask.name}
          onChangeText={(text) => setNewTask((prev) => ({ ...prev, name: text }))}
          returnKeyType="done"
        />

        {/* Category */}
        <View style={styles.categoryWrap}>
          <CategoryPickerField
            categories={categories}
            selectedCategoryId={newTask.category_id}
            onValueChange={(id) => setNewTask((prev) => ({ ...prev, category_id: id }))}
          />
        </View>

        {/* Repeat days */}
        <Text variant="textBase" style={styles.label}>repeat</Text>
        <View style={styles.daysRow}>
          {DAYS.map((day, i) => {
            const selected = newTask.repeatDays?.includes(i)
            return (
              <Pressable
                key={i}
                onPress={() => toggleDay(i)}
                style={[
                  styles.dayCircle,
                  selected ? styles.daySelected : styles.dayUnselected,
                ]}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: selected }}
              >
                <Text style={[styles.dayText, selected && styles.dayTextSelected]}>
                  {day}
                </Text>
              </Pressable>
            )
          })}
        </View>

        {/* Task color */}
        <Text variant="textBase" style={styles.label}>task color</Text>
        <View style={styles.colorRow}>
          {TASK_COLORS.map((color) => (
            <Pressable
              key={color.id}
              onPress={() => setNewTask((prev) => ({ ...prev, color }))}
              style={[
                styles.colorSwatch,
                { backgroundColor: color.code },
                newTask.color?.id === color.id && styles.colorSelected,
              ]}
              accessibilityRole="radio"
              accessibilityState={{ selected: newTask.color?.id === color.id }}
            />
          ))}
        </View>

        {/* Sub tasks */}
        <Text variant="textBase" style={styles.label}>add sub task</Text>
        {(newTask.subTasks ?? []).map((sub, i) => (
          <Text key={sub.id} style={styles.subTaskItem}>
            {i + 1}  {sub.name}
          </Text>
        ))}
        <TextInput
          style={[styles.input, styles.subInput]}
          placeholder={`${(newTask.subTasks?.length ?? 0) + 1} thermoflask of water`}
          placeholderTextColor="#636366"
          value={subTaskInput}
          onChangeText={setSubTaskInput}
          onSubmitEditing={addSubTask}
          returnKeyType="done"
        />

        <View style={styles.spacer} />
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.footer}>
        <Pressable
          onPress={handleCreateTask}
          style={[styles.createBtn, showToast && styles.createBtnSuccess]}
          accessibilityRole="button"
          accessibilityLabel="Create task"
        >
          <Text style={[styles.createBtnText, showToast && styles.createBtnSuccessText]}>
            {showToast ? "task added !" : "create task"}
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000000",
  },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  navTitle: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 18,
    letterSpacing: 0.4,
  },
  carrotIcon: {
    fontSize: 24,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  label: {
    color: "#8E8E93",
    fontSize: 13,
    letterSpacing: 0.6,
    marginTop: 20,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 17,
    color: "#ffffff",
  },
  categoryWrap: {
    marginTop: 20,
  },
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  dayUnselected: {
    borderColor: "#3A3A3C",
    backgroundColor: "transparent",
  },
  daySelected: {
    borderColor: "#FF375F",
    backgroundColor: "#FF375F22",
  },
  dayText: {
    color: "#636366",
    fontWeight: "600",
    fontSize: 13,
  },
  dayTextSelected: {
    color: "#FF375F",
  },
  colorRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  colorSwatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    marginBottom: 10,
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: "#ffffff",
  },
  subInput: {
    marginTop: 8,
  },
  subTaskItem: {
    color: "#8E8E93",
    fontSize: 15,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  spacer: {
    height: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 12,
    backgroundColor: "#000000",
  },
  createBtn: {
    backgroundColor: "#1C1C1E",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FF375F",
  },
  createBtnSuccess: {
    borderColor: "#30D158",
    backgroundColor: "#30D15820",
  },
  createBtnText: {
    color: "#FF375F",
    fontWeight: "700",
    fontSize: 17,
    letterSpacing: 0.5,
  },
  createBtnSuccessText: {
    color: "#30D158",
  },
})

export default CreateTask
