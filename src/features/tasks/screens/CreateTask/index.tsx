import useGlobalStore from "@/store"
import { Box, Text } from "@/shared/utils/theme"
import { useNavigation } from "@react-navigation/native"
import { nanoid } from "nanoid/non-secure"
import React, { useState } from "react"
import { ActivityIndicator, Pressable } from "react-native"
import FormInput from "@/shared/components/FormInput"
import CategoryPickerField from "../../components/CategoryPickerField"

const CreateTask = () => {
  const {
    categories,
    selectedCategory,
    addTask,
    isCreatingTask,
    setIsCreatingTask,
  } = useGlobalStore()
  const navigation = useNavigation()

  const [newTask, setNewTask] = useState<ITask>({
    id: `task_${nanoid()}`,
    name: "",
    category_id: selectedCategory?.id ?? "",
    completed: false,
  })

  const handleCreateTask = () => {
    if (!newTask.name.trim()) return
    setIsCreatingTask(true)
    addTask(newTask)
    setIsCreatingTask(false)
    navigation.navigate("Home")
  }

  return (
    <Box flex={1} bg="gray100" p="4" pb="10">
      <Box flexDirection="column" alignItems="center" justifyContent="space-between">
        <Box
          width="100%"
          flexDirection="column"
          alignItems="center"
          justifyContent="space-between"
        >
          <FormInput
            placeholder="Task name"
            value={newTask.name}
            onChangeText={(text) =>
              setNewTask((prev) => ({ ...prev, name: text }))
            }
          />
          <Box height={20} />
          <CategoryPickerField
            categories={categories}
            selectedCategoryId={newTask.category_id}
            onValueChange={(id) =>
              setNewTask((prev) => ({ ...prev, category_id: id }))
            }
          />
        </Box>

        <Box
          mx="4"
          bg="blu500"
          width="100%"
          borderRadius="roundedXl"
          p="4"
          alignItems="center"
          style={{ marginTop: "100%" }}
        >
          <Pressable
            onPress={handleCreateTask}
            disabled={isCreatingTask}
            accessibilityRole="button"
            accessibilityLabel="Create task"
          >
            {isCreatingTask ? (
              <ActivityIndicator color="#bfdbfe" />
            ) : (
              <Text variant="textXl" color="blu200">
                Create
              </Text>
            )}
          </Pressable>
        </Box>
      </Box>
    </Box>
  )
}

export default CreateTask
