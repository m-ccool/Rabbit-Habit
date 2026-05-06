import useGlobalStore from "@/store"
import { getColors } from "@/shared/utils/helpers"
import { Box, Text, Theme } from "@/shared/utils/theme"
import { Picker } from "@react-native-picker/picker"
import { useNavigation } from "@react-navigation/native"
import { useTheme } from "@shopify/restyle"
import { nanoid } from "nanoid/non-secure"
import React, { useState } from "react"
import { Pressable } from "react-native"
import FormInput from "@/shared/components/FormInput"

const COLORS = getColors()

const CreateCategory = () => {
  const navigation = useNavigation()
  const { addCategory } = useGlobalStore()
  const theme = useTheme<Theme>()

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
    <Box flex={1} bg="dark900" pb="10">
      <Box flex={1} flexDirection="column" justifyContent="space-between" mx="3">
        <Box flexDirection="column" width="100%">
          <Box mt="5">
            <FormInput
              placeholder="Category name"
              value={newCategory.name}
              onChangeText={(text) =>
                setNewCategory((prev) => ({ ...prev, name: text }))
              }
            />
          </Box>
          <Box height={20} />
          <Picker
            selectedValue={newCategory.color.id}
            onValueChange={(itemValue) => {
              const found = COLORS.find((c) => c.id === itemValue)
              if (found) {
                setNewCategory((prev) => ({ ...prev, color: found }))
              }
            }}
            style={{
              backgroundColor: theme.colors.dark700,
              color: "#ffffff",
              borderRadius: 16,
            }}
          >
            {COLORS.map((colorItem) => (
              <Picker.Item
                key={colorItem.id}
                label={colorItem.name}
                value={colorItem.id}
                style={{ borderWidth: 2, borderRadius: 40 }}
              />
            ))}
          </Picker>
        </Box>

        <Pressable
          onPress={handleCreateCategory}
          accessibilityRole="button"
          accessibilityLabel="Create category"
        >
          <Box bg="blu500" py="4" borderRadius="rounded2Xl" alignItems="center">
            <Text color="blu200" variant="textXl">
              Create
            </Text>
          </Box>
        </Pressable>
      </Box>
    </Box>
  )
}

export default CreateCategory
