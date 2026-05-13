import useGlobalStore from "@/store"
import { getColors } from "@/shared/utils/helpers"
import { COLORS } from "@/shared/utils/theme"
import { Box, Text } from "@/shared/utils/theme"
import { Picker } from "@react-native-picker/picker"
import { useNavigation } from "@react-navigation/native"
import { nanoid } from "nanoid/non-secure"
import React, { useState } from "react"
import { Pressable } from "react-native"
import FormInput from "@/shared/components/FormInput"

const LOCAL_COLORS = getColors()

const CreateCategory = () => {
  const navigation = useNavigation()
  const { addCategory } = useGlobalStore()

  const [newCategory, setNewCategory] = useState<ICategory>({
    name: "",
    id: `category_${nanoid()}`,
    color: { code: "", id: "", name: "" },
  })

  const handleCreateCategory = () => {
    if (!newCategory.name.trim()) return
    addCategory(newCategory)
    setNewCategory({
      name: "",
      id: `category_${nanoid()}`,
      color: { code: "", id: "", name: "" },
    })
    navigation.navigate("Home")
  }

  return (
    <Box flex={1} bg="dark900" pb="10" px="4">
      <Box flex={1} justifyContent="space-between">
        <Box width="100%" mt="5">
          <Text variant="textBase" color="gray200" mb="2">
            Category name
          </Text>
          <Box>
            <FormInput
              placeholder="Category name"
              value={newCategory.name}
              onChangeText={(text) =>
                setNewCategory((prev) => ({ ...prev, name: text }))
              }
            />
          </Box>
          <Box height={20} />
          <Text variant="textBase" color="gray200" mb="2">
            Category color
          </Text>
          <Picker
            selectedValue={newCategory.color.id}
            onValueChange={(itemValue) => {
              const found = LOCAL_COLORS.find((c) => c.id === itemValue)
              if (found) {
                setNewCategory((prev) => ({ ...prev, color: found }))
              }
            }}
            style={{ backgroundColor: COLORS.muted, borderRadius: 8 }}
          >
            {LOCAL_COLORS.map((colorItem) => (
              <Picker.Item
                key={colorItem.id}
                label={colorItem.name}
                value={colorItem.id}
                style={{ backgroundColor: COLORS.card }}
              />
            ))}
          </Picker>
        </Box>

        <Pressable
          onPress={handleCreateCategory}
          accessibilityRole="button"
          accessibilityLabel="Create category"
          style={({ pressed }) => [{ opacity: pressed ? 0.88 : 1 }]}
        >
          <Box bg="systemBlue" py="4" borderRadius="rounded2Xl" alignItems="center" mb="4">
            <Text variant="textXl">Create</Text>
          </Box>
        </Pressable>
      </Box>
    </Box>
  )
}

export default CreateCategory
