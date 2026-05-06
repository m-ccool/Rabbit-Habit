import { RootStackParamList } from "@/navigation/types"
import useGlobalStore from "@/store"
import { Box, Text } from "@/shared/utils/theme"
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import React, { useState } from "react"
import { ActivityIndicator, Pressable } from "react-native"
import FormInput from "@/shared/components/FormInput"
import CategoryPickerField from "../../components/CategoryPickerField"

type EditTaskRoute = RouteProp<RootStackParamList, "EditTask">

const EditTask = () => {
  const { categories, updateTasks, tasks, isDeletingTask, setIsDeletingTask } =
    useGlobalStore()
  const navigation = useNavigation()
  const { params } = useRoute<EditTaskRoute>()

  const [editedTask, setEditedTask] = useState<ITask>(params.task)

  const handleSaveTask = () => {
    const updatedTasks = tasks.map((t) =>
      t.id === editedTask.id ? { ...editedTask } : t
    )
    updateTasks(updatedTasks)
    navigation.navigate("Home")
  }

  const handleDeleteTask = () => {
    setIsDeletingTask(true)
    const updatedTasks = tasks.filter((t) => t.id !== editedTask.id)
    updateTasks(updatedTasks)
    setIsDeletingTask(false)
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
            value={editedTask.name}
            onChangeText={(text) =>
              setEditedTask((prev) => ({ ...prev, name: text }))
            }
          />
          <Box height={20} />
          <CategoryPickerField
            categories={categories}
            selectedCategoryId={editedTask.category_id}
            onValueChange={(id) =>
              setEditedTask((prev) => ({ ...prev, category_id: id }))
            }
          />
        </Box>

        {/* Delete */}
        <Box
          mx="4"
          bg="red500"
          width="100%"
          borderRadius="roundedXl"
          p="4"
          alignItems="center"
          style={{ marginTop: "60%" }}
        >
          <Pressable
            onPress={handleDeleteTask}
            disabled={isDeletingTask}
            accessibilityRole="button"
            accessibilityLabel="Delete task"
          >
            {isDeletingTask ? (
              <ActivityIndicator color="#bfdbfe" />
            ) : (
              <Text variant="textXl" color="blu200">
                Delete
              </Text>
            )}
          </Pressable>
        </Box>

        {/* Save */}
        <Box
          mx="4"
          bg="blu500"
          width="100%"
          borderRadius="roundedXl"
          p="4"
          alignItems="center"
          style={{ marginTop: 20 }}
        >
          <Pressable
            onPress={handleSaveTask}
            accessibilityRole="button"
            accessibilityLabel="Save task"
          >
            <Text variant="textXl" color="blu200">
              Save
            </Text>
          </Pressable>
        </Box>
      </Box>
    </Box>
  )
}

export default EditTask
