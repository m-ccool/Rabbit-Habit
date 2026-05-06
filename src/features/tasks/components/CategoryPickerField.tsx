import { Box, Text } from "@/shared/utils/theme"
import { Picker } from "@react-native-picker/picker"
import React from "react"

type CategoryPickerFieldProps = {
  categories: ICategory[]
  selectedCategoryId: string
  onValueChange: (categoryId: string) => void
}

/**
 * Reusable category picker used in CreateTask and EditTask screens.
 * Extracted to avoid duplication.
 */
const CategoryPickerField = ({
  categories,
  selectedCategoryId,
  onValueChange,
}: CategoryPickerFieldProps) => {
  return (
    <Box width="100%">
      <Picker
        style={{
          backgroundColor: "white",
          borderRadius: 16,
        }}
        selectedValue={selectedCategoryId}
        onValueChange={(itemValue) => {
          const found = categories.find((c) => c.id === itemValue)
          if (found) {
            onValueChange(found.id)
          }
        }}
      >
        {categories.map((category) => (
          <Picker.Item
            key={category.id}
            label={category.name}
            value={category.id}
            style={{ backgroundColor: "white" }}
          />
        ))}
      </Picker>
    </Box>
  )
}

export default CategoryPickerField
